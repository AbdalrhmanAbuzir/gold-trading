using GoldMarket.DTOs;

namespace GoldMarket.Services.Product
{
    public interface IProductService
    {
        Task<Guid> CreateProductAsync(CreateProductDto dto, Guid sellerId);

        Task<List<ProductDetailsDto>> GetAllProductsAsync(ProductFilterDto filter);
        Task UpdatProducteAsync(Guid productId, UpdateProductDto dto, Guid sellerId);

        Task DeleteProductAsync(Guid productId, Guid sellerId);
        Task<ProductDetailsDto> GetProductByIdAsync(Guid productId);

        public Task<List<ProductDetailsDto>> GetRelatedProductsAsync(Guid productId);
    }
}
