using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.DTOs
{
    public class ProductDetailsDto
    {
        public Guid Id { get; set; }
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public decimal Weight { get; set; }
        public int Karat { get; set; }

        public decimal FinalPrice { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }

        public ProductPricingType PricingType { get; set; }

        public decimal? FixedPrice { get; set; }

        public decimal PriceAdjustmentPerGram { get; set; }

        public ManufacturingCostType? ManufacturingType { get; set; }

        public decimal ManufacturingValue { get; set; }
        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public List<ProductImageDto> Images { get; set; }

        public List<ProductShopDto> GoldShops { get; set; }

    }
}

