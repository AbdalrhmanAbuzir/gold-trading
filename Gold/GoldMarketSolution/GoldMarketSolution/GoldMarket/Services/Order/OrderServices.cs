using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Helpers;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using GoldMarket.Services.Notification;
using Microsoft.EntityFrameworkCore;

namespace GoldMarket.Services.Order
{
    public class OrderServices : IOrderServices
    {

        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly INotificationService _notificationService;

        public OrderServices(
            AppDbContext context,
            IWebHostEnvironment environment,
            INotificationService notificationService)
        {
            _context = context;
            _environment = environment;
            _notificationService = notificationService;
        }

        public async Task<Guid> CreateOrderAsync(CreateOrderDto dto, Guid buyerId)
        {
            var user = await _context.Users.FindAsync(buyerId);
            if (user == null) { 
                throw new Exception("The Account is not found.");
            }

            if (user.VerificationStatus != VerificationStatus.Approved)
            {
                throw new Exception("Account verification is required.");
            }


            var limit = await _context.UserLimits
            .FirstOrDefaultAsync(x => x.UserId == buyerId);

            if (limit != null && limit.IsBlocked && limit.BlockUntil > DateTime.UtcNow)
            {
                throw new Exception(
                    $"User is blocked until {limit.BlockUntil}");
            }

            var product = await _context.Products
                .Include(x => x.ProductGoldShops)
                .FirstOrDefaultAsync(x => x.Id == dto.ProductId);

            if (product == null)
                throw new Exception("Product not found");

            if (product.Status != ProductStatus.Available)
                throw new Exception("Product is not available");

            if (product.SellerId == buyerId)
                throw new Exception("You cannot buy your own product");

            // check allowed gold shop
            var isAllowed = product.ProductGoldShops
                .Any(x => x.GoldShopId == dto.GoldShopId);

            if (!isAllowed)
                throw new Exception("Gold shop not allowed");

            // get price
            decimal lockedPrice;

            var goldPrice = await _context.GoldPrices
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

                if (goldPrice == null)
                    throw new Exception("Gold price not found");

           lockedPrice = PriceCalculatorHelper.CalculateProductPrice(product, goldPrice);


            // create order
            var order = new GoldMarket.Models.Order
            {
                Id = Guid.NewGuid(),

                ProductId = product.Id,
                BuyerId = buyerId,
                SellerId = product.SellerId,
                GoldShopId = dto.GoldShopId,

                Status = OrderStatus.Reserved,

                ReservedAt = DateTime.UtcNow,
                ReservedUntil = DateTime.UtcNow.AddHours(48),

                LockedPrice = lockedPrice
            };

            // update product
            product.Status = ProductStatus.Reserved;

            _context.Orders.Add(order);

            await _notificationService.SendAsync(
            product.SellerId,
            "New Order Reserved",
            $"Your product '{product.Title}' has been reserved",
            "Order",
            order.Id
            );

            await _notificationService.SendAsync(
                buyerId,
                "Order Reserved",
                $"You reserved '{product.Title}' successfully",
                "Order",
                order.Id
            );

            await _context.SaveChangesAsync();

            return order.Id;
        }


        public async Task ExpireOrdersAsync()
        {
            var expiredOrders = await _context.Orders
                .Include(x => x.Product)
                .Where(x =>
                    x.Status == OrderStatus.Reserved &&
                    x.ReservedUntil < DateTime.UtcNow)
                .ToListAsync();

            foreach (var order in expiredOrders)
            {
                order.Status = OrderStatus.Expired;

                if (order.Product != null)
                {
                    order.Product.Status = ProductStatus.Available;
                }
            }

            await _context.SaveChangesAsync();
        }


     

        public async Task CompleteOrderAsync(Guid orderId, Guid currentUserId, CompleteOrderDto dto)
        {
           
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == currentUserId);

            if (user == null)
                throw new Exception("User not found");

            var isGoldShop = user.UserRoles
                .Any(x => x.Role.Name == "GoldShop");

            if (!isGoldShop)
                throw new Exception("Only GoldShop users can complete orders");

            if (user.GoldShopId == null)
                throw new Exception("User is not assigned to a GoldShop");


            var order = await _context.Orders
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                throw new Exception("Order not found");


            if (order.Status != OrderStatus.Reserved)
                throw new Exception("Order must be reserved first");

            if (order.Status == OrderStatus.Completed)
                throw new Exception("Order already completed");

            if (order.GoldShopId != user.GoldShopId)
                throw new Exception("This order does not belong to your GoldShop");

            if (dto.ReceiptImage == null)
                throw new Exception("Receipt image is required");

   
            var uploadsFolder = Path.Combine("wwwroot/uploads/receipts");

            var fileName = await FileHelper.SaveImageAsync(
                dto.ReceiptImage,
                uploadsFolder);

            var verification = new OrderVerification
            {
                Id = Guid.NewGuid(),

                OrderId = order.Id,
                GoldShopId = user.GoldShopId.Value,
                VerifiedByUserId = user.Id,

                ReceiptImageUrl = $"/uploads/receipts/{fileName}",
                Notes = dto.Notes,

                VerifiedAt = DateTime.UtcNow
            };

            order.Status = OrderStatus.Completed;
            order.CompletedAt = DateTime.UtcNow;

            order.Product.Status = ProductStatus.Sold;

            _context.OrderVerifications.Add(verification);

            await _notificationService.SendAsync(
            order.BuyerId,
            "Order Completed",
            "Your order has been completed successfully",
            "Order",
            order.Id
            );

            await _notificationService.SendAsync(
                order.SellerId,
                "Order Completed",
                "Your product has been sold",
                "Order",
                order.Id
            );

            await _context.SaveChangesAsync();
        }


        public async Task CancelOrderAsync(Guid orderId, Guid userId, CancelOrderDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var order = await _context.Orders
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                throw new Exception("Order not found");

            if (order.BuyerId != userId)
                throw new Exception("You can only cancel your own orders");

            if (order.Status != OrderStatus.Reserved)
                throw new Exception("Only reserved orders can be cancelled");

            // check limit
            var limit = await _context.UserLimits
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (limit == null)
            {
                limit = new UserLimit
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CancellationCount = 0,
                    LastResetDate = DateTime.UtcNow
                };

                _context.UserLimits.Add(limit);
            }

            if (limit.LastResetDate.AddDays(7) < DateTime.UtcNow)
            {
                limit.CancellationCount = 0;
                limit.LastResetDate = DateTime.UtcNow;
            }

    
            limit.CancellationCount++;

           
            _context.UserOrderCancellations.Add(new UserOrderCancellation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderId = orderId,
                Reason = dto.Reason,
                CancelledAt = DateTime.UtcNow
            });

            if (limit.CancellationCount >= 3)
            {
                limit.IsBlocked = true;
                limit.BlockUntil = DateTime.UtcNow.AddHours(24);
            }


            order.Product.Status = ProductStatus.Available;


            order.Status = OrderStatus.Cancelled;

            await _context.SaveChangesAsync();
        }
    }
}