namespace GoldMarket.Services.Price
{
    public class GoldPriceBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public GoldPriceBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();

                var service = scope.ServiceProvider.GetRequiredService<IGoldPriceSyncService>();

                await service.SyncAsync();

                await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
            }
        }
    }
}
