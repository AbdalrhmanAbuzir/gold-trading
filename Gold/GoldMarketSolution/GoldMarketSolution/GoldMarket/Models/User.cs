using GoldMarket.Models.Enums;

namespace GoldMarket.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string IdentityImageUrl { get; set; }

        public string FaceImageUrl { get; set; }
        public string? ProfileImageUrl { get; set; }
        public VerificationStatus VerificationStatus { get; set; }

        public string? VerificationRejectionReason { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public Guid? VerifiedByAdminId { get; set; }

        public bool IsActive { get; set; }

        public bool AcceptedTerms { get; set; }
        public DateTime? TermsAcceptedAt { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid? GoldShopId { get; set; }

        public GoldShop? GoldShop { get; set; }


        public List<UserRole> UserRoles { get; set; }

        public List<Product> Products { get; set; }

        public List<Order> BuyerOrders { get; set; }
        public List<Order> SellerOrders { get; set; }
    }
}
