namespace GoldMarket.Models
{
    public class OrderVerification
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        public Guid GoldShopId { get; set; }
        public GoldShop GoldShop { get; set; }

        public Guid VerifiedByUserId { get; set; }
        public User VerifiedByUser { get; set; }

        public string ReceiptImageUrl { get; set; }
        public string Notes { get; set; }

        public DateTime VerifiedAt { get; set; }
    }
}
