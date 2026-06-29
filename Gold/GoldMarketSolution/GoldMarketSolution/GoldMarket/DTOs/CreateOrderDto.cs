namespace GoldMarket.DTOs
{
    public class CreateOrderDto
    {
        public Guid ProductId { get; set; }
        public Guid GoldShopId { get; set; }
    }
}
