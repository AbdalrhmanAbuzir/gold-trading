using GoldMarket.DTOs;

namespace GoldMarket.Services.Profile
{
    public interface IProfileService
    {
        public Task<UserProfileDto> GetProfileAsync(Guid userId);

        public Task UpdateProfileAsync(Guid userId, UpdateProfileDto dto);

        public Task<List<ProductDetailsDto>>GetMyProductsAsync(Guid userId);

        public Task<List<MyOrderDto>> GetMyOrdersAsync(Guid userId);

        public Task<List<MySaleDto>> GetMySalesAsync(Guid userId);
    }
}
