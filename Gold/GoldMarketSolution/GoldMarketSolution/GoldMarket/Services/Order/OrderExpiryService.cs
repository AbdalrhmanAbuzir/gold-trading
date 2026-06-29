namespace GoldMarket.Services.Order
{
    public class OrderExpiryService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderExpiryService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();

                var service = scope.ServiceProvider
                    .GetRequiredService<IOrderServices>();

                await service.ExpireOrdersAsync();

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
