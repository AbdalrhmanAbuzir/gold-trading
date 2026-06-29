using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.DTOs
{
    public class UpdateProductDto
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

        public List<Guid>? GoldShopIds { get; set; } = new();
        public List<Guid>? DeletedImageIds { get; set; } = new();
        public List<IFormFile>? NewImages { get; set; }
    }
}
