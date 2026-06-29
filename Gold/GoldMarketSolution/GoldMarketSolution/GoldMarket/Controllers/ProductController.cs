using GoldMarket.DTOs;
using GoldMarket.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GoldMarket.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

      
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
        {
            var sellerId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

           var id =  await _service.CreateProductAsync(dto, sellerId);

            return Ok(new { Message = "Product created successfully." , ProductID = id});
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
        {
            return Ok(await _service.GetAllProductsAsync(filter));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateProductDto dto)
        {
            var sellerId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.UpdatProducteAsync(id, dto, sellerId);

            return Ok(new
            {
                Message = "Product updated successfully"
            });
        }


        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _service.GetProductByIdAsync(id);

            return Ok(product);
        }

        [AllowAnonymous]
        [HttpGet("{id}/related")]
        public async Task<IActionResult> GetRelated(Guid id)
        {
            return Ok(await _service.GetRelatedProductsAsync(id));
        }


        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var sellerId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.DeleteProductAsync(id, sellerId);

            return Ok(new
            {
                Message = "Product deleted successfully."
            });
        }

    }
}
