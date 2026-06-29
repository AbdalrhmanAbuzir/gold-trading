namespace GoldMarket.Models
{
    public class Notification
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public string Title { get; set; }
        public string Message { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        // optional: link to entity
        public string? Type { get; set; } // Order, Product, System
        public Guid? RelatedId { get; set; }
    }
}
