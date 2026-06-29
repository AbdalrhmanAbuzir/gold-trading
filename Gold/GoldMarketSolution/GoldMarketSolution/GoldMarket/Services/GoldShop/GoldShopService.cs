using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.DTOs.GoldPrice;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GoldMarket.Services.GoldShop
{
    public class GoldShopService : IGoldShopService
    {

        private readonly AppDbContext _context;

        public GoldShopService(AppDbContext context)
        {
            _context = context;
        }
        private async Task<User> GetGoldShopUser(Guid userId)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            var isGoldShop = user.UserRoles
                .Any(x => x.Role.Name == "GoldShop");

            if (!isGoldShop)
                throw new Exception("Only GoldShop users can access this.");

            if (user.GoldShopId == null)
                throw new Exception("GoldShop not assigned.");

            return user;
        }

        public async Task<List<GoldShopOrderDto>>
    GetOrdersAsync(Guid userId)
        {
            var user = await GetGoldShopUser(userId);

            return await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .Where(x => x.GoldShopId == user.GoldShopId)
                .OrderByDescending(x => x.ReservedAt)
                .Select(x => new GoldShopOrderDto
                {
                    OrderId = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    SellerName = x.Seller.FullName,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt,
                    CompletedAt = x.CompletedAt
                })
                .ToListAsync();
        }

        public async Task<List<GoldShopOrderDto>>
    GetReservedOrdersAsync(Guid userId)
        {
            var user = await GetGoldShopUser(userId);

            return await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .Where(x =>
                    x.GoldShopId == user.GoldShopId &&
                    x.Status == OrderStatus.Reserved)
                .Select(x => new GoldShopOrderDto
                {
                    OrderId = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    SellerName = x.Seller.FullName,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt
                })
                .ToListAsync();
        }

        public async Task<List<GoldShopOrderDto>>
        GetCompletedOrdersAsync(Guid userId)
        {
            var user = await GetGoldShopUser(userId);

            return await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .Where(x =>
                    x.GoldShopId == user.GoldShopId &&
                    x.Status == OrderStatus.Completed)
                .Select(x => new GoldShopOrderDto
                {
                    OrderId = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    SellerName = x.Seller.FullName,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt
                })
                .ToListAsync();
        }


        public async Task<GoldShopOrderDetailsDto>GetOrderDetailsAsync(Guid orderId, Guid userId)
        {
            var user = await GetGoldShopUser(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var order = await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .Include(x => x.GoldShop)
                .FirstOrDefaultAsync(x =>
                    x.Id == orderId &&
                    x.GoldShopId == user.GoldShopId);

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            var verification = await _context.OrderVerifications
                .FirstOrDefaultAsync(x => x.OrderId == order.Id);

            return new GoldShopOrderDetailsDto
            {
                OrderId = order.Id,

                ProductTitle = order.Product.Title,

                BuyerName = order.Buyer.FullName,
                BuyerPhone = order.Buyer.Phone,

                SellerName = order.Seller.FullName,
                SellerPhone = order.Seller.Phone,

                LockedPrice = order.LockedPrice,

                Status = order.Status.ToString(),

                ReservedAt = order.ReservedAt,
                ReservedUntil = order.ReservedUntil,

                CompletedAt = order.CompletedAt,

                ReceiptImageUrl = verification?.ReceiptImageUrl,
                Notes = verification?.Notes
            };
        }


        public async Task<GoldShopDashboardDto> GetDashboardAsync(Guid userId)
        {
            var user = await GetGoldShopUser(userId);

            var shopId = user.GoldShopId.Value;

            var ordersQuery = _context.Orders
                .Include(x => x.Product)
                .Where(x => x.GoldShopId == shopId);

            var totalOrders = await ordersQuery.CountAsync();

            var reserved = await ordersQuery
                .CountAsync(x => x.Status == OrderStatus.Reserved);

            var completed = await ordersQuery
                .CountAsync(x => x.Status == OrderStatus.Completed);

            var cancelled = await ordersQuery
                .CountAsync(x => x.Status == OrderStatus.Cancelled);

            var revenue = await ordersQuery
                .Where(x => x.Status == OrderStatus.Completed)
                .SumAsync(x => x.LockedPrice);

            var latestOrders = await ordersQuery
                .OrderByDescending(x => x.ReservedAt)
                .Take(10)
                .Select(x => new GoldShopOrderDto
                {
                    OrderId = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    SellerName = x.Seller.FullName,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt,
                    CompletedAt = x.CompletedAt
                })
                .ToListAsync();

            var topProducts = await _context.Orders
                .Where(x => x.GoldShopId == shopId)
                .GroupBy(x => new
                {
                    x.ProductId,
                    x.Product.Title
                })
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key.ProductId,
                    Title = g.Key.Title,
                    OrdersCount = g.Count()
                })
                .OrderByDescending(x => x.OrdersCount)
                .Take(5)
                .ToListAsync();

            return new GoldShopDashboardDto
            {
                TotalOrders = totalOrders,
                ReservedOrders = reserved,
                CompletedOrders = completed,
                CancelledOrders = cancelled,
                TotalRevenue = revenue,
                LatestOrders = latestOrders,
                TopProducts = topProducts
            };
        }

    }
}
