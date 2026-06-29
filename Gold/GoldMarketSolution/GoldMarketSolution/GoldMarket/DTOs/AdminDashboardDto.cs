namespace GoldMarket.DTOs
{
    public class AdminDashboardDto
    {
        public int UsersCount { get; set; }
        public int PendingUsers { get; set; }
        public int ApprovedUsers { get; set; }
        public int ProductsCount { get; set; }
        public int OrdersCount { get; set; }
        public int CompletedOrders { get; set; }
        public decimal Revenue { get; set; }
    }
}
