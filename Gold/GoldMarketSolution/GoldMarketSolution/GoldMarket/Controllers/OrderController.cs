using GoldMarket.DTOs;
using GoldMarket.Services.Order;
using GoldMarket.Services.Product;
using GoldMarket.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderServices _service;
        private readonly AppDbContext _context;

        public OrderController(IOrderServices service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {

            var buyerId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var orderId = await _service.CreateOrderAsync(dto, buyerId);

            return Ok(orderId);
        }

        [Authorize]
        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelOrderDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.CancelOrderAsync(id, userId, dto);

            return Ok("Order cancelled successfully");
        }

        [Authorize(Roles = "GoldShop")]
        [HttpPost("complete/{id}")]
        public async Task<IActionResult> Complete(Guid id, [FromForm] CompleteOrderDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.CompleteOrderAsync(id, userId, dto);

            return Ok("Order completed successfully");
        }


        [HttpPost("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder(Guid orderId, CancelOrderDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.CancelOrderAsync(orderId, userId, dto);

            return Ok("Order cancelled successfully");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var order = await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.GoldShop)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .FirstOrDefaultAsync(x => x.Id == id && (x.BuyerId == userId || x.SellerId == userId));

            if (order == null)
                return NotFound("Order not found or access denied.");

            var verification = await _context.OrderVerifications
                .FirstOrDefaultAsync(x => x.OrderId == order.Id);

            return Ok(new
            {
                Id = order.Id,
                ProductTitle = order.Product.Title,
                GoldShopName = order.GoldShop.Name,
                LockedPrice = order.LockedPrice,
                Status = order.Status.ToString(),
                CreatedAt = order.ReservedAt,
                ExpiresAt = order.ReservedUntil,
                CompletedAt = order.CompletedAt,
                ReceiptImageUrl = verification?.ReceiptImageUrl,
                Notes = verification?.Notes,
                BuyerName = order.Buyer?.FullName,
                BuyerPhone = order.Buyer?.Phone,
                SellerName = order.Seller?.FullName,
                SellerPhone = order.Seller?.Phone
            });
        }

    }
}
