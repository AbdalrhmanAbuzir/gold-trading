using GoldMarket.DTOs;
using GoldMarket.Services.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _service;

        public ProfileController(IProfileService service) {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetProfileAsync(userId));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.UpdateProfileAsync(userId, dto);

            return Ok("Profile updated successfully");
        }

        [HttpGet("my-products")]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetMyProductsAsync(userId));
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetMyOrdersAsync(userId));
        }

        [HttpGet("my-sales")]
        public async Task<IActionResult> GetMySales()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _service.GetMySalesAsync(userId));
        }
    }
}
