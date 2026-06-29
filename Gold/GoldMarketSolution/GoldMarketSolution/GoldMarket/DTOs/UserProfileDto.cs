namespace GoldMarket.DTOs
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public string ProfileImageUrl { get; set; }

        public string VerificationStatus { get; set; }

        public List<string> Roles { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
