namespace GoldMarket.DTOs
{
    public class BlockUserDto
    {
        public Guid UserId { get; set; }
        public string? Reason { get; set; }
        public int Days { get; set; }
    }
}
