namespace GoldMarket.Models.Enums
{
    public class ProductPricing
    {
        public enum ProductPricingType
        {
            FixedPrice = 1,

            MarketSellPrice = 2,

            MarketBuyPrice = 3
        }

        public enum ManufacturingCostType
        {
            FixedAmount = 1,

            PerGram = 2
        }
    }
}
