namespace GoldMarket.DTOs
{
    public class AdminUserDetailsDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string? ProfileImageUrl { get; set; }
        public string? FaceImageUrl { get; set; }

        public string IdentityImageUrl { get; set; }

        public string VerificationStatus { get; set; }

        public string? VerificationRejectionReason { get; set; }

        public bool IsActive { get; set; }
        public bool IsBlocked { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public string? GoldShopName { get; set; }

        public Guid? GoldShopId { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
