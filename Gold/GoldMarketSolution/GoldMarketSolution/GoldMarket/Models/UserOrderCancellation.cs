namespace GoldMarket.Models
{
    public class UserOrderCancellation
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        public DateTime CancelledAt { get; set; }
        public string Reason { get; set; }
    }
}
