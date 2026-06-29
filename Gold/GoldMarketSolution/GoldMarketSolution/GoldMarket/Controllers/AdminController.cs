using GoldMarket.Data;
using GoldMarket.DTOs;
using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GoldMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var usersCount = await _context.Users.CountAsync();
            var pendingUsers = await _context.Users
                .CountAsync(x => x.VerificationStatus == VerificationStatus.Pending);

            var approvedUsers = await _context.Users
                .CountAsync(x => x.VerificationStatus == VerificationStatus.Approved);

            var productsCount = await _context.Products.CountAsync();

            var ordersCount = await _context.Orders.CountAsync();

            var completedOrders = await _context.Orders
                .CountAsync(x => x.Status == OrderStatus.Completed);

            var revenue = await _context.Orders
                .Where(x => x.Status == OrderStatus.Completed)
                .SumAsync(x => x.LockedPrice);

            return Ok(new
            {
                usersCount,
                pendingUsers,
                approvedUsers,
                productsCount,
                ordersCount,
                completedOrders,
                revenue
            });
        }


        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .Select(x => new
                {
                    x.Id,
                    x.FullName,
                    x.Email,
                    x.IsActive,
                    VerificationStatus = x.VerificationStatus.ToString(),
                    Roles = x.UserRoles.Select(r => r.Role.Name)
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("pending-users")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var users = await _context.Users
                .Where(x => x.VerificationStatus == VerificationStatus.Pending)
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("verify-user")]
        public async Task<IActionResult> VerifyUser(VerifyUserDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == dto.UserId);

            if (user == null)
                return NotFound("User not found");

            if (dto.IsApproved)
            {
                user.VerificationStatus = VerificationStatus.Approved;
                user.IsActive = true;
                user.VerifiedAt = DateTime.UtcNow;
            }
            else
            {
                user.VerificationStatus = VerificationStatus.Rejected;
                user.VerificationRejectionReason = dto.Reason;
                user.IsActive = false;
            }

            user.VerifiedByAdminId =
                Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _context.SaveChangesAsync();

            return Ok("User verification updated");
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole(AssignRoleDto dto)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                .FirstOrDefaultAsync(x => x.Id == dto.UserId);

            if (user == null)
                return NotFound("User not found");

            var roleExists = await _context.Roles
                .AnyAsync(x => x.Id == dto.RoleId);

            if (!roleExists)
                return NotFound("Role not found");

            // Remove all existing roles for the user
            var existingRoles = await _context.UserRoles
                .Where(x => x.UserId == dto.UserId)
                .ToListAsync();

            _context.UserRoles.RemoveRange(existingRoles);

            // Add the new role
            _context.UserRoles.Add(new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId
            });

            // If the user is no longer a GoldShop, clear GoldShopId association
            if (dto.RoleId != 3) // GoldShop role is Id 3
            {
                user.GoldShopId = null;
            }

            await _context.SaveChangesAsync();

            return Ok("Role assigned");
        }

        [HttpPost("block-user")]
        public async Task<IActionResult> BlockUser(BlockUserDto dto)
        {
            var user = await _context.Users
    .FirstOrDefaultAsync(x => x.Id == dto.UserId);

            if (user == null)
                return NotFound("User not found");

            var limit = await _context.UserLimits
                .FirstOrDefaultAsync(x => x.UserId == dto.UserId);

            if (limit == null)
            {
                limit = new UserLimit
                {
                    Id = Guid.NewGuid(),
                    UserId = dto.UserId,
                    CancellationCount = 0,
                    LastResetDate = DateTime.UtcNow
                };

                _context.UserLimits.Add(limit);
            }

            limit.IsBlocked = true;
            limit.BlockUntil = DateTime.UtcNow.AddDays(dto.Days);

            await _context.SaveChangesAsync();

            return Ok("User blocked successfully");
        }


        [HttpPost("activate-goldshop")]
        public async Task<IActionResult> ActivateGoldShop(ActivateGoldShopDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == dto.UserId);

            if (user == null)
                return NotFound("User not found");

            var goldShop = await _context.GoldShops
                .FirstOrDefaultAsync(x => x.Id == dto.GoldShopId);

            if (goldShop == null)
                return NotFound("GoldShop not found");

            if (!goldShop.IsVerified)
            {
                return BadRequest("GoldShop is not verified");
            }

            // assign relation
            user.GoldShopId = dto.GoldShopId;

            // Remove all existing roles for the user
            var existingRoles = await _context.UserRoles
                .Where(x => x.UserId == user.Id)
                .ToListAsync();

            _context.UserRoles.RemoveRange(existingRoles);

            // Add GoldShop role
            _context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = 3 // GoldShop
            });

            await _context.SaveChangesAsync();

            return Ok("GoldShop activated for user");
        }


        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .Include(x => x.GoldShop)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound("User not found");

            var result = new AdminUserDetailsDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,

                ProfileImageUrl = user.ProfileImageUrl,
                FaceImageUrl = user.FaceImageUrl,
                IdentityImageUrl = user.IdentityImageUrl,

                VerificationStatus = user.VerificationStatus.ToString(),
                VerificationRejectionReason = user.VerificationRejectionReason,

                IsActive = user.IsActive,

                CreatedAt = user.CreatedAt,
                VerifiedAt = user.VerifiedAt,
                GoldShopId = user.GoldShopId,
                GoldShopName = user.GoldShop?.Name,

                Roles = user.UserRoles
                    .Select(x => x.Role.Name)
                    .ToList()
            };

            return Ok(result);
        }

        [HttpPost("unblock-user")]
        public async Task<IActionResult> UnblockUser(Guid userId)
        {
            var limit = await _context.UserLimits
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (limit == null)
                return NotFound("User limit not found");

            limit.IsBlocked = false;
            limit.BlockUntil = null;

            await _context.SaveChangesAsync();

            return Ok("User unblocked successfully");
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles
                .Select(x => new
                {
                    x.Id,
                    x.Name
                })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpGet("goldshops")]
        public async Task<IActionResult> GetGoldShops()
        {
            var shops = await _context.GoldShops
                .Where(x => x.IsVerified)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Address
                })
                .ToListAsync();

            return Ok(shops);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(x => x.Product)
                .Include(x => x.Buyer)
                .Include(x => x.Seller)
                .Include(x => x.GoldShop)
                .OrderByDescending(x => x.ReservedAt)
                .Select(x => new
                {
                    Id = x.Id,
                    ProductTitle = x.Product.Title,
                    BuyerName = x.Buyer.FullName,
                    SellerName = x.Seller.FullName,
                    GoldShopName = x.GoldShop.Name,
                    LockedPrice = x.LockedPrice,
                    Status = x.Status.ToString(),
                    CreatedAt = x.ReservedAt,
                    CompletedAt = x.CompletedAt
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
