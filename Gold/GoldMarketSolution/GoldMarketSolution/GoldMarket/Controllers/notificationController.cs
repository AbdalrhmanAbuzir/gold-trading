using GoldMarket.Services.Notification;
using GoldMarket.Services.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class notificationController : ControllerBase
    {

        private readonly INotificationService _service;

        public notificationController(INotificationService service)
        {
            _service = service;
        }


        [Authorize]
        [HttpGet("my-notifications")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var notifications = await _service.GetUserNotificationsAsync(userId);

            return Ok(notifications);
        }

        [HttpPost("mark-as-read/{id}")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _service.MarkAsReadAsync(id, userId);

            return Ok("Marked as read");
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var count = await _service.GetUnreadCountAsync(userId);

            return Ok(new { count });
        }
    }
}
