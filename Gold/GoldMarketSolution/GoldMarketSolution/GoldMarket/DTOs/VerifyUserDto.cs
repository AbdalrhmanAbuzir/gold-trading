namespace GoldMarket.DTOs
{
    public class VerifyUserDto
    {
        public Guid UserId { get; set; }
        public bool IsApproved { get; set; }
        public string? Reason { get; set; }
    }
}
