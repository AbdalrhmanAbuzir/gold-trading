using GoldMarket.Data;
using GoldMarket.Services.Order;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoldPriceController : ControllerBase
    {

        private readonly AppDbContext _context;

        public GoldPriceController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult Get()
        {
            var res = _context.GoldPrices
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefault();

            if (res == null)
                return NotFound();

            return Ok(new
            {
                sell24K = res.Sell24K,
                buy24K = res.Buy24K,

                sell21K = res.Sell21K,
                buy21K = res.Buy21K,

                sell18K = res.Sell18K,
                buy18K = res.Buy18K,

                sellLiraEnglish = res.SellLiraEnglish,
                buyLiraEnglish = res.BuyLiraEnglish,

                sellLiraRashadi = res.SellLiraRashadi,
                buyLiraRashadi = res.BuyLiraRashadi,

                updatedAt = res.CreatedAt
            });
        }

    }
}
