namespace GoldMarket.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Password { get; set; }

        public IFormFile ProfileImage { get; set; }
        public IFormFile IdentityImage { get; set; }
        public IFormFile FaceImage { get; set; }

        public bool AcceptedTerms { get; set; }
    }
}
