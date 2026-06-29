using GoldMarket.DTOs;
using GoldMarket.DTOs.GoldPrice;

namespace GoldMarket.Services.GoldShop
{
    public interface IGoldShopService
    {
        Task<List<GoldShopOrderDto>> GetOrdersAsync(Guid userId);

        Task<List<GoldShopOrderDto>> GetReservedOrdersAsync(Guid userId);

        Task<List<GoldShopOrderDto>> GetCompletedOrdersAsync(Guid userId);

        Task<GoldShopOrderDetailsDto>GetOrderDetailsAsync(Guid orderId, Guid userId);

        public  Task<GoldShopDashboardDto> GetDashboardAsync(Guid userId);
    }
}
