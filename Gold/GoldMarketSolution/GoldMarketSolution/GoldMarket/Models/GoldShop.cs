namespace GoldMarket.Models
{
    public class GoldShop
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Phone { get; set; }
        public string LicenseNumber { get; set; }

        public string Address { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public bool IsVerified { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<User> Employees { get; set; } = new();
        public List<ProductGoldShop> ProductGoldShops { get; set; } = new();
        public List<Order> Orders { get; set; }
    }
}
