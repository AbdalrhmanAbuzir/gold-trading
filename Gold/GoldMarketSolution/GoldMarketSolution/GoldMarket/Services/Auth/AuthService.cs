using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Helpers;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GoldMarket.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            var exists = await _context.Users.AnyAsync(x => x.Email == dto.Email);
            if (exists)
                throw new Exception("Email already exists");

            if (!dto.AcceptedTerms) {
                throw new Exception("the terms must be accepted");
            }

            if (dto.FaceImage == null)
                throw new Exception("Face image is required.");

            if (dto.IdentityImage == null)
                throw new Exception("Identity image is required.");

            if (dto.ProfileImage == null)
                throw new Exception("Identity image is required.");


            var profileImageName = await FileHelper.SaveImageAsync(
                 dto.ProfileImage,
                 "wwwroot/uploads/users/photos"
             );

            var identityImageName = await FileHelper.SaveImageAsync(
            dto.IdentityImage,
            "wwwroot/uploads/users/ids"
            );

            var FaceImageName = await FileHelper.SaveImageAsync(
                dto.FaceImage,
                "wwwroot/uploads/users/face"
            );

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                ProfileImageUrl = $"/uploads/users/photos/{profileImageName}",
                IdentityImageUrl = $"/uploads/users/ids/{identityImageName}",
                FaceImageUrl = $"/uploads/users/face/{FaceImageName}",
                IsActive = true,
                VerificationStatus = VerificationStatus.Pending,
                AcceptedTerms = dto.AcceptedTerms,
                TermsAcceptedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            // assign default role = User (RoleId = 2)
            _context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = 2
            });

            await _context.SaveChangesAsync();

            return GenerateToken(user);
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                throw new Exception("Invalid credentials");

            var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!valid)
                throw new Exception("Invalid credentials");

            if (!user.IsActive)
                throw new Exception("Account is inactive");

            return GenerateToken(user);
        }

        private string GenerateToken(User user)
        {
            var jwt = _config.GetSection("Jwt");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim("VerificationStatus", user.VerificationStatus.ToString()
    )
        };

            var roles = _context.UserRoles
                .Where(x => x.UserId == user.Id)
                .Select(x => x.Role.Name)
                .ToList();

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(jwt["DurationInMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
