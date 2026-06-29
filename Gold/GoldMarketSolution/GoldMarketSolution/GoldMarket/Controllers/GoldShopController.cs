using GoldMarket.DTOs;
using GoldMarket.Services.GoldShop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "GoldShopOnly")]
    public class GoldShopController : ControllerBase
    {
        private readonly IGoldShopService _service;

        public GoldShopController(IGoldShopService service)
        {
            _service = service;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetOrdersAsync(userId));
        }

        [HttpGet("orders/reserved")]
        public async Task<IActionResult> GetReservedOrders()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetReservedOrdersAsync(userId));
        }

        [HttpGet("orders/completed")]
        public async Task<IActionResult> GetCompletedOrders()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetCompletedOrdersAsync(userId));
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderDetails(Guid id)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(
                await _service.GetOrderDetailsAsync(id, userId));
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetDashboardAsync(userId));
        }
    }
}