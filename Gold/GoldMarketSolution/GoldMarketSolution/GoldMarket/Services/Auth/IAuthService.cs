using GoldMarket.DTOs;

namespace GoldMarket.Services.Auth
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto dto);

        Task<string> LoginAsync(LoginDto dto);
    }
}
