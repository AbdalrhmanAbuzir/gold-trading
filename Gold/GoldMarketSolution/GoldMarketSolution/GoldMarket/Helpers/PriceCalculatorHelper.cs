using GoldMarket.Models;
using static GoldMarket.Models.Enums.ProductPricing;

namespace GoldMarket.Helpers
{
    public class PriceCalculatorHelper
    {
        public static decimal CalculateProductPrice(
         Product product,
         GoldPrices goldPrice)
        {
            if (product.PricingType ==
                ProductPricingType.FixedPrice)
            {
                return product.FixedPrice ?? 0;
            }

            decimal gramPrice = GetGramPrice(product, goldPrice);

            decimal total =
                gramPrice * product.Weight;

            total +=
                product.PriceAdjustmentPerGram *
                product.Weight;

            if (product.ManufacturingType ==
                ManufacturingCostType.FixedAmount)
            {
                total += product.ManufacturingValue;
            }
            else if (product.ManufacturingType ==
                     ManufacturingCostType.PerGram)
            {
                total +=
                    product.ManufacturingValue *
                    product.Weight;
            }

            return total;
        }

        private static decimal GetGramPrice(Product product, GoldPrices price)
        {
            return product.Karat switch
            {
                24 => product.PricingType == ProductPricingType.MarketSellPrice
                        ? price.Sell24K
                        : price.Buy24K,
                        
                21 => product.PricingType == ProductPricingType.MarketSellPrice
                        ? price.Sell21K
                        : price.Buy21K,

                18 => product.PricingType == ProductPricingType.MarketSellPrice
                        ? price.Sell18K
                        : price.Buy18K,

                _ => throw new Exception("Unsupported Karat")
            };
        }
    }
}
