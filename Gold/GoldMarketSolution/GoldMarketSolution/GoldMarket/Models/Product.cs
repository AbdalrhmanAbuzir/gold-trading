using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.Models
{
    public class Product
    {
        public Guid Id { get; set; }

        public Guid SellerId { get; set; }
        public User Seller { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        [Precision(18, 3)]
        public decimal Weight { get; set; }

        public int Karat { get; set; }

        public ProductPricingType PricingType { get; set; }

        [Precision(18, 3)]
        public decimal? FixedPrice { get; set; }

        [Precision(18, 3)]
        public decimal PriceAdjustmentPerGram { get; set; }

        public ManufacturingCostType? ManufacturingType { get; set; }

        [Precision(18, 3)]
        public decimal ManufacturingValue { get; set; }

        public ProductStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid CategoryId { get; set; }
        public Category Category { get; set; }

        public List<ProductGoldShop> ProductGoldShops { get; set; } = new();
        public List<ProductImage> Images { get; set; } = new();

        public List<Order> Orders { get; set; } = new();
    }
}

