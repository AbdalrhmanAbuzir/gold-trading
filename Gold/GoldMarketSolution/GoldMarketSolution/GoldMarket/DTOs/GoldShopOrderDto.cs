namespace GoldMarket.DTOs
{
    public class GoldShopOrderDto
    {
        public Guid OrderId { get; set; }

        public string ProductTitle { get; set; }

        public string BuyerName { get; set; }

        public string SellerName { get; set; }

        public decimal LockedPrice { get; set; }

        public string Status { get; set; }

        public DateTime ReservedAt { get; set; }

        public DateTime? CompletedAt { get; set; }
    }
}
