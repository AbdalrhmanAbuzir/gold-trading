using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace GoldMarket.Models
{
    public class Order
    {
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }

        public Guid SellerId { get; set; }
        public User Seller { get; set; }

        public Guid? GoldShopId { get; set; }
        public GoldShop GoldShop { get; set; }

        public OrderStatus Status { get; set; } // Reserved / Completed / Cancelled / Expired

        public DateTime ReservedAt { get; set; }
        public DateTime ReservedUntil { get; set; }

        [Precision(18, 2)]
        public decimal LockedPrice { get; set; }

        public DateTime? CompletedAt { get; set; }
    }
}
