namespace GoldMarket.DTOs
{
    public class GoldShopDashboardDto
    {
        public int TotalOrders { get; set; }
        public int ReservedOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }

        public decimal TotalRevenue { get; set; }

        public List<GoldShopOrderDto> LatestOrders { get; set; }

        public List<TopProductDto> TopProducts { get; set; }
    }
}
