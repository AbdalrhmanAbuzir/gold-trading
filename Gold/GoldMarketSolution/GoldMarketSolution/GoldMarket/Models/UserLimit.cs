namespace GoldMarket.Models
{
    public class UserLimit
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }

        public int CancellationCount { get; set; }

        public DateTime LastResetDate { get; set; }

        public bool IsBlocked { get; set; }

        public DateTime? BlockUntil { get; set; }
    }
}
