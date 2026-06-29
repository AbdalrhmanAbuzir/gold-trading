namespace GoldMarket.DTOs
{
    public class TopProductDto
    {
        public Guid ProductId { get; set; }
        public string Title { get; set; }
        public int OrdersCount { get; set; }
    }
}
