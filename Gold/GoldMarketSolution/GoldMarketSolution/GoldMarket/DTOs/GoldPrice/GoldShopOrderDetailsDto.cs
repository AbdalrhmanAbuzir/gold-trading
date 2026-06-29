namespace GoldMarket.DTOs.GoldPrice
{
    public class GoldShopOrderDetailsDto
    {
        public Guid OrderId { get; set; }

        public string ProductTitle { get; set; }

        public string BuyerName { get; set; }
        public string BuyerPhone { get; set; }

        public string SellerName { get; set; }
        public string SellerPhone { get; set; }

        public decimal LockedPrice { get; set; }

        public string Status { get; set; }

        public DateTime ReservedAt { get; set; }
        public DateTime ReservedUntil { get; set; }

        public DateTime? CompletedAt { get; set; }

        public string? ReceiptImageUrl { get; set; }
        public string? Notes { get; set; }
    }
}
