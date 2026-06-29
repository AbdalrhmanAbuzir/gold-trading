using GoldMarket.Models;
using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.DTOs
{
    public class CreateProductDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }

        public decimal? Weight { get; set; }
        public int? Karat { get; set; }

        public Guid? CategoryId { get; set; }

        public ProductPricingType? PricingType { get; set; }

        public decimal? FixedPrice { get; set; }

        public decimal? PriceAdjustmentPerGram { get; set; }

        public ManufacturingCostType? ManufacturingType { get; set; }

        public decimal? ManufacturingValue { get; set; }

        public List<IFormFile>? Images { get; set; }

        public List<Guid>? GoldShopIds { get; set; } = new();
    }
}
