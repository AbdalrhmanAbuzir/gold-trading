using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Helpers;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.Services.Product
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductService(
            AppDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<Guid> CreateProductAsync(CreateProductDto dto, Guid sellerId)
        {
            var user = await _context.Users.FindAsync(sellerId);
            if (user == null)
            {
                throw new Exception("The Account is not found.");
            }

            if (user.VerificationStatus != VerificationStatus.Approved)
            {
                throw new Exception("Account verification is required.");
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                throw new Exception("Title is required.");
            }

            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                throw new Exception("Description is required.");
            }

            if (!dto.Weight.HasValue || dto.Weight.Value <= 0)
            {
                throw new Exception("Weight must be greater than 0.");
            }

            if (!dto.Karat.HasValue || dto.Karat.Value <= 0)
            {
                throw new Exception("Karat is required.");
            }

            if (!dto.CategoryId.HasValue || dto.CategoryId.Value == Guid.Empty)
            {
                throw new Exception("Category is required.");
            }

            if (!dto.PricingType.HasValue)
            {
                throw new Exception("Pricing Type is required.");
            }

            if (dto.PricingType.Value == ProductPricingType.FixedPrice && !dto.FixedPrice.HasValue)
            {
                throw new Exception("Fixed price is required.");
            }

            if (dto.Images == null || !dto.Images.Any())
            {
                throw new Exception("At least one image is required.");
            }

            if (dto.GoldShopIds == null || !dto.GoldShopIds.Any())
            {
                throw new Exception("At least one GoldShop must be selected.");
            }

            var categoryExists = await _context.Categories
                .AnyAsync(x => x.Id == dto.CategoryId.Value);

            if (!categoryExists)
            {
                throw new Exception("Category not found.");
            }

            var validShops = await _context.GoldShops
                .Where(x => dto.GoldShopIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync();
             
            if (validShops.Count != dto.GoldShopIds.Count)
            {
                throw new Exception("One or more GoldShops are invalid.");
            }
            
            var product = new GoldMarket.Models.Product
            {
                Id = Guid.NewGuid(),
                SellerId = sellerId,
                Title = dto.Title,
                Description = dto.Description,
                Weight = dto.Weight.Value,
                Karat = dto.Karat.Value,
                CategoryId = dto.CategoryId.Value,
                PricingType = dto.PricingType.Value,
                FixedPrice = dto.FixedPrice,
                PriceAdjustmentPerGram = dto.PriceAdjustmentPerGram ?? 0,
                ManufacturingType = dto.ManufacturingType,
                ManufacturingValue = dto.ManufacturingValue ?? 0,
                Status = ProductStatus.Available,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var shopId in dto.GoldShopIds)
            {
                product.ProductGoldShops.Add(new ProductGoldShop
                {
                    ProductId = product.Id,
                    GoldShopId = shopId
                });
            }

            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "products");

            foreach (var image in dto.Images)
            {
                var fileName = await FileHelper
                    .SaveImageAsync(image, uploadsFolder);

                product.Images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    ImageUrl = fileName
                });
            }

            _context.Products.Add(product);

            await _context.SaveChangesAsync();
            return (product.Id);
        }


        //ProductFilterDto filter
        public async Task<List<ProductDetailsDto>> GetAllProductsAsync(ProductFilterDto filter)
        {
            var query = _context.Products
                .Where(x => x.Status == ProductStatus.Available)
                .Include(x => x.Images)
                .Include(x => x.Category)
                .Include(x => x.Seller)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                query = query.Where(x =>
                    x.Title.Contains(filter.Search) ||
                    x.Description.Contains(filter.Search));
            }

            if (filter.Karat.HasValue)
            {
                query = query.Where(x => x.Karat == filter.Karat.Value);
            }

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == filter.CategoryId.Value);
            }

            if (filter.SellerId.HasValue)
            {
                query = query.Where(x => x.SellerId == filter.SellerId.Value);
            }

            var products = await query.ToListAsync();

            var goldPrice = await _context.GoldPrices
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (goldPrice == null)
                throw new Exception("Gold price not found.");

            var result = products.Select(p => new ProductDetailsDto
            {
                Id = p.Id,
                SellerId = p.SellerId,

                Title = p.Title,
                Description = p.Description,

                Weight = p.Weight,
                Karat = p.Karat,

                SellerName = p.Seller.FullName,

                PricingType = p.PricingType,
                FixedPrice = p.FixedPrice,
                PriceAdjustmentPerGram = p.PriceAdjustmentPerGram,

                ManufacturingType = p.ManufacturingType,
                ManufacturingValue = p.ManufacturingValue,

                FinalPrice = PriceCalculatorHelper
                    .CalculateProductPrice(p, goldPrice),

                Status = p.Status.ToString(),

                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,

                CreatedAt = p.CreatedAt,

                Images = p.Images.Select(image => new ProductImageDto
                {
                    Id = image.Id,
                    ImageUrl = image.ImageUrl
                }).ToList()

            }).ToList();

            // Price Filter
            if (filter.MinPrice.HasValue)
            {
                result = result
                    .Where(x => x.FinalPrice >= filter.MinPrice.Value)
                    .ToList();
            }

            if (filter.MaxPrice.HasValue)
            {
                result = result
                    .Where(x => x.FinalPrice <= filter.MaxPrice.Value)
                    .ToList();
            }

            // Sorting
            switch (filter.SortBy?.ToLower())
            {
                case "priceasc":
                    result = result.OrderBy(x => x.FinalPrice).ToList();
                    break;

                case "pricedesc":
                    result = result.OrderByDescending(x => x.FinalPrice).ToList();
                    break;

                case "oldest":
                    result = result.OrderBy(x => x.CreatedAt).ToList();
                    break;

                default:
                    result = result.OrderByDescending(x => x.CreatedAt).ToList();
                    break;
            }

            // Pagination
            result = result
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return result;
        }

        public async Task UpdatProducteAsync(Guid productId, UpdateProductDto dto, Guid sellerId)
        {
            if (productId == Guid.Empty)
                throw new Exception("ProductId is empty");

            var user = await _context.Users.FindAsync(sellerId);
            if (user == null || user.VerificationStatus != VerificationStatus.Approved)
            {
                throw new Exception("Account verification is required.");
            }

            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                throw new Exception("Product not found.");

            if (product.SellerId != sellerId)
                throw new Exception("You are not allowed to edit this product.");

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new Exception("Title is required.");

            if (string.IsNullOrWhiteSpace(dto.Description))
                throw new Exception("Description is required.");

            if (!dto.Weight.HasValue || dto.Weight.Value <= 0)
                throw new Exception("Weight must be greater than 0.");

            if (!dto.Karat.HasValue || dto.Karat.Value <= 0)
                throw new Exception("Karat is required.");

            if (!dto.CategoryId.HasValue || dto.CategoryId.Value == Guid.Empty)
                throw new Exception("Category is required.");

            if (!dto.PricingType.HasValue)
                throw new Exception("Pricing Type is required.");

            if (dto.PricingType.Value == ProductPricingType.FixedPrice && !dto.FixedPrice.HasValue)
                throw new Exception("Fixed price is required.");

            if (dto.GoldShopIds == null || !dto.GoldShopIds.Any())
                throw new Exception("At least one GoldShop must be selected.");

            var categoryExists = await _context.Categories.AnyAsync(x => x.Id == dto.CategoryId.Value);
            if (!categoryExists)
                throw new Exception("Category not found.");

            var validShops = await _context.GoldShops
                .Where(x => dto.GoldShopIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync();

            if (validShops.Count != dto.GoldShopIds.Count)
                throw new Exception("One or more GoldShops are invalid.");

            // update basic fields
            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Weight = dto.Weight.Value;
            product.Karat = dto.Karat.Value;
            product.CategoryId = dto.CategoryId.Value;

            product.PricingType = dto.PricingType.Value;
            product.FixedPrice = dto.FixedPrice;
            product.PriceAdjustmentPerGram = dto.PriceAdjustmentPerGram ?? 0;
            product.ManufacturingType = dto.ManufacturingType;
            product.ManufacturingValue = dto.ManufacturingValue ?? 0;

            product.UpdatedAt = DateTime.UtcNow;

            #region DELETE IMAGES
            if (dto.DeletedImageIds != null && dto.DeletedImageIds.Any())
            {
                var imagesToDelete = product.Images
                    .Where(x => dto.DeletedImageIds.Contains(x.Id))
                    .ToList();

                _context.ProductImages.RemoveRange(imagesToDelete);
            }
            #endregion

            #region ADD NEW IMAGES
            if (dto.NewImages != null && dto.NewImages.Any())
            {
                var folderPath = Path.Combine(
                    _environment.WebRootPath,
                    "uploads",
                    "products");

                foreach (var file in dto.NewImages)
                {
                    var fileName = await FileHelper.SaveImageAsync(file, folderPath);

                    product.Images.Add(new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        ImageUrl = fileName
                    });
                }
            }
            #endregion

            // ensure at least 1 image exists
            if (product.Images.Count == 0)
                throw new Exception("Product must have at least one image.");

            var existingShops = await _context.ProductGoldShops
                .Where(x => x.ProductId == product.Id)
                .ToListAsync();

            _context.ProductGoldShops.RemoveRange(existingShops);

            foreach (var shopId in dto.GoldShopIds)
            {
                _context.ProductGoldShops.Add(new ProductGoldShop
                {
                    ProductId = product.Id,
                    GoldShopId = shopId
                });
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }


        public async Task<ProductDetailsDto> GetProductByIdAsync(Guid productId)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Include(p => p.ProductGoldShops)
                    .ThenInclude(x => x.GoldShop)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                throw new Exception("Product not found.");

            if (product.Status == ProductStatus.Hidden)
                throw new Exception("Product not found.");

            var goldPrice = await _context.GoldPrices
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (goldPrice == null)
                throw new Exception("Gold price not found.");

            var finalPrice = PriceCalculatorHelper.CalculateProductPrice(product, goldPrice);

            return new ProductDetailsDto
            {
                Id = product.Id,
                SellerId = product.SellerId,
                SellerName = product.Seller.FullName,

                Title = product.Title,
                Description = product.Description,

                Weight = product.Weight,
                Karat = product.Karat,

                FinalPrice = finalPrice,

                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,

                PricingType = product.PricingType,
                FixedPrice = product.FixedPrice,
                PriceAdjustmentPerGram = product.PriceAdjustmentPerGram,
                ManufacturingType = product.ManufacturingType,
                ManufacturingValue = product.ManufacturingValue,

                Status = product.Status.ToString(),
                CreatedAt = product.CreatedAt,

                Images = product.Images.Select(x => new ProductImageDto
                {
                    Id = x.Id,
                    ImageUrl = x.ImageUrl
                }).ToList(),

                GoldShops = product.ProductGoldShops.Select(x => new ProductShopDto
                {
                    Id = x.GoldShop.Id,
                    Name = x.GoldShop.Name,
                    Address = x.GoldShop.Address
                }).ToList()
            };
        }


        public async Task<List<ProductDetailsDto>> GetRelatedProductsAsync(Guid productId)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
                return new List<ProductDetailsDto>();

            var related = await _context.Products
                .Where(x =>
                    x.CategoryId == product.CategoryId &&
                    x.Id != productId &&
                    x.Status == ProductStatus.Available)
                .Include(x => x.Images)
                .Include(x => x.Seller)
                .Take(10)
                .ToListAsync();

            var goldPrice = await _context.GoldPrices
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            return related.Select(x => new ProductDetailsDto
            {
                Id = x.Id,
                Title = x.Title,
                FinalPrice = PriceCalculatorHelper.CalculateProductPrice(x, goldPrice),
                Images = x.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl
                }).ToList()
            }).ToList();
        }

        public async Task DeleteProductAsync(Guid productId, Guid sellerId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == productId);

            if (product == null)
                throw new Exception("Product not found.");

            if (product.SellerId != sellerId)
                throw new Exception("You are not allowed to delete this product.");

            product.Status = ProductStatus.Hidden;

            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

    }
}
