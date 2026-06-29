using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Models;
using Microsoft.EntityFrameworkCore;

namespace GoldMarket.Services.Notification
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendAsync(Guid userId, string title, string message, string type = null, Guid? relatedId = null)
        {
            var notification = new GoldMarket.Models.Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                RelatedId = relatedId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(Guid userId)
        {
            return await _context.Notifications
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new NotificationDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Message = x.Message,
                    Type = x.Type,
                    RelatedId = x.RelatedId,
                    IsRead = x.IsRead,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
        }


        public async Task MarkAsReadAsync(Guid notificationId, Guid userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId);

            if (notification == null)
                throw new Exception("Notification not found");

            notification.IsRead = true;

            await _context.SaveChangesAsync();
        }


        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(x => x.UserId == userId && !x.IsRead);
        }
    }
}