namespace GoldMarket.DTOs
{
    public class MySaleDto
    {
        public Guid Id { get; set; }

        public string ProductTitle { get; set; }

        public string BuyerName { get; set; }

        public decimal LockedPrice { get; set; }

        public string Status { get; set; }

        public DateTime ReservedAt { get; set; }
    }
}
