using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Helpers;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace GoldMarket.Services.Profile
{
    public class ProfileService : IProfileService
    {

        private readonly AppDbContext _context;
        public ProfileService(AppDbContext context)
        {
            _context = context;

        }

        public async Task<UserProfileDto> GetProfileAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                ProfileImageUrl = user.ProfileImageUrl,
                VerificationStatus = user.VerificationStatus.ToString(),
                CreatedAt = user.CreatedAt,
                Roles = user.UserRoles
                .Select(x => x.Role.Name)
                .ToList()
            };
        }

        public async Task UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            if (string.IsNullOrWhiteSpace(dto.FullName))
                throw new Exception("Full name is required");

            if (string.IsNullOrWhiteSpace(dto.Phone))
                throw new Exception("Phone is required");

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.UpdatedAt = DateTime.UtcNow;

            if (dto.ProfileImage != null)
            {
                var uploadsFolder = Path.Combine(
                    "wwwroot/uploads/users/photos");

                var fileName = await FileHelper.SaveImageAsync(dto.ProfileImage, uploadsFolder);

                user.ProfileImageUrl =$"/uploads/users/photos/{fileName}";
            }

            await _context.SaveChangesAsync();
        }


        public async Task<List<ProductDetailsDto>>GetMyProductsAsync(Guid userId)
        {
            var goldPrice = await _context.GoldPrices
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

            if (goldPrice == null)
                throw new Exception("Gold price not found");

            return await _context.Products
                .Where(x => x.SellerId == userId && x.Status != ProductStatus.Hidden)
                .Include(x => x.Images)
                .Select(x => new ProductDetailsDto
                {
                    Id = x.Id,
                    SellerId = x.SellerId,
                    Title = x.Title,
                    Description = x.Description,
                    Weight = x.Weight,
                    Karat = x.Karat,
                    SellerName = x.Seller.FullName,
                    PricingType = x.PricingType,
                    FixedPrice = x.FixedPrice,
                    PriceAdjustmentPerGram = x.PriceAdjustmentPerGram,
                    ManufacturingType = x.ManufacturingType,
                    ManufacturingValue = x.ManufacturingValue,
                    Status = x.Status.ToString(),
                    CategoryId = x.CategoryId,
                    CreatedAt = x.CreatedAt,
                    FinalPrice = PriceCalculatorHelper.CalculateProductPrice(x, goldPrice),
                    Images = x.Images.Select(image => new ProductImageDto
                    {
                        Id = image.Id,
                        ImageUrl = image.ImageUrl
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<List<MyOrderDto>> GetMyOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.GoldShop)
                .Where(x => x.BuyerId == userId)
                .Select(x => new MyOrderDto
                {
                    Id = x.Id,
                    ProductTitle = x.Product.Title,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt,
                    GoldShopName = x.GoldShop.Name,
                    CompletedAt = x.CompletedAt,
                    ReservedUntil = x.ReservedUntil,
                })
                .ToListAsync();
        }

        public async Task<List<MySaleDto>> GetMySalesAsync(Guid userId)
        {
            return await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Where(x => x.SellerId == userId)
                .Select(x => new MySaleDto
                {
                    Id = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    ReservedAt = x.ReservedAt
                })
                .ToListAsync();
        }

    }
}
