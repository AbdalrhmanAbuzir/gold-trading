namespace GoldMarket.DTOs
{
    public class MyOrderDto
    {
        public Guid Id { get; set; }

        public string ProductTitle { get; set; }

        public decimal LockedPrice { get; set; }

        public string Status { get; set; }

        public DateTime ReservedAt { get; set; }

        public string GoldShopName { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime ReservedUntil { get; set; }
    }
}
