namespace GoldMarket.DTOs
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; }

        public string Phone { get; set; }

        public IFormFile? ProfileImage { get; set; }
    }
}
