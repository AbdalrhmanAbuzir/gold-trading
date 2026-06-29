namespace GoldMarket.Models
{
    public class Category
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<Product> Products { get; set; }
    }
}
