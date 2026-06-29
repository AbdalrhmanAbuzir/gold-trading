using GoldMarket.DTOs;

namespace GoldMarket.Services.Order
{
    public interface IOrderServices
    {
        Task<Guid> CreateOrderAsync(CreateOrderDto dto, Guid buyerId);

        Task ExpireOrdersAsync();

        Task CompleteOrderAsync(Guid orderId, Guid currentUserId, CompleteOrderDto dto);

        public Task CancelOrderAsync(Guid orderId, Guid userId, CancelOrderDto dto);
    }
}
