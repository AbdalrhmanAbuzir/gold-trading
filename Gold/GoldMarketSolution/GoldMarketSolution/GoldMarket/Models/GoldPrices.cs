using Microsoft.EntityFrameworkCore;

namespace GoldMarket.Models
{
    public class GoldPrices
    {
        public int Id { get; set; }

        [Precision(18, 3)]
        public decimal Sell24K { get; set; }

        [Precision(18, 3)]
        public decimal Buy24K { get; set; }

        [Precision(18, 3)]
        public decimal Sell21K { get; set; }

        [Precision(18, 3)]
        public decimal Buy21K { get; set; }

        [Precision(18, 3)]
        public decimal Sell18K { get; set; }

        [Precision(18, 3)]
        public decimal Buy18K { get; set; }

        [Precision(18, 3)]
        public decimal SellLiraEnglish { get; set; }

        [Precision(18, 3)]
        public decimal BuyLiraEnglish { get; set; }

        [Precision(18, 3)]
        public decimal SellLiraRashadi { get; set; }

        [Precision(18, 3)]
        public decimal BuyLiraRashadi { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}