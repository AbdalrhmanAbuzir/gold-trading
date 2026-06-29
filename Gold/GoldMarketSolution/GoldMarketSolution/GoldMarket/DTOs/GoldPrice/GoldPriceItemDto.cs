namespace GoldMarket.DTOs.GoldPrice
{
    public class GoldPriceItemDto
    {
        public PriceObjectDto Sell_24K { get; set; }
        public PriceObjectDto Buy_24K { get; set; }

        public PriceObjectDto Sell_21K { get; set; }
        public PriceObjectDto Buy_21K { get; set; }

        public PriceObjectDto Sell_18K { get; set; }
        public PriceObjectDto Buy_18K { get; set; }

        public PriceObjectDto Sell_Lira_English { get; set; }
        public PriceObjectDto Buy_Lira_English { get; set; }

        public PriceObjectDto Sell_Lira_Rshadi { get; set; }
        public PriceObjectDto Buy_Lira_Rshadi { get; set; }
    }
}
