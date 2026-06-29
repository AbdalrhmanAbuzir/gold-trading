using GoldMarket.Data;
using GoldMarket.DTOs.GoldPrice;
using GoldMarket.Models;
using System.Text.Json;

namespace GoldMarket.Services.Price
{
    public class GoldPriceSyncService : IGoldPriceSyncService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;

        public GoldPriceSyncService(HttpClient httpClient, AppDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        public async Task SyncAsync()
        {
            var today = DateTime.UtcNow.Date;

            var dateFrom = today.ToString("yyyy-MM-dd");
            var dateTo = today.ToString("yyyy-MM-dd");
        
            var url = $"https://api.royanews.tv/api/v2/gold-prices?type=1&date_from={dateFrom}&date_to={dateTo}";

            var response = await _httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();


            var json = await response.Content.ReadAsStringAsync();

            var data =
                JsonSerializer.Deserialize<GoldPriceApiResponseDto>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });


            var item = data?.Data?.Gold_Prices?.FirstOrDefault();

            if (item == null)
                throw new Exception("No gold prices found.");

            var entity = new GoldPrices
            {
                Sell24K = decimal.Parse(item.Sell_24K.Price),

                Buy24K = decimal.Parse(item.Buy_24K.Price),

                Sell21K = decimal.Parse(item.Sell_21K.Price),

                Buy21K = decimal.Parse(item.Buy_21K.Price),

                Sell18K = decimal.Parse(item.Sell_18K.Price),

                Buy18K = decimal.Parse(item.Buy_18K.Price),

                SellLiraEnglish = decimal.Parse(item.Sell_Lira_English.Price),

                BuyLiraEnglish = decimal.Parse(item.Buy_Lira_English.Price),

                SellLiraRashadi = decimal.Parse(item.Sell_Lira_Rshadi.Price),

                BuyLiraRashadi = decimal.Parse(item.Buy_Lira_Rshadi.Price),

                CreatedAt = DateTime.UtcNow
            };

            _context.GoldPrices.Add(entity);

            await _context.SaveChangesAsync();
        }
    }
}
