namespace GoldMarket.Models
{
    public class ProductGoldShop
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public Guid GoldShopId { get; set; }
        public GoldShop GoldShop { get; set; }
    }
}
