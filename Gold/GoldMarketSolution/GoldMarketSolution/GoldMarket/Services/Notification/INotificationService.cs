using GoldMarket.DTOs;

namespace GoldMarket.Services.Notification 
{ 
public interface INotificationService
{
        Task SendAsync(Guid userId, string title, string message, string type = null, Guid? relatedId = null);
        Task<List<NotificationDto>> GetUserNotificationsAsync(Guid userId);

        Task MarkAsReadAsync(Guid notificationId, Guid userId);

        Task<int> GetUnreadCountAsync(Guid userId);
    }
}
