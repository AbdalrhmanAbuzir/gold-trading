using GoldMarket.Models;
using GoldMarket.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace GoldMarket.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<GoldShop> GoldShops { get; set; }

        public DbSet<OrderVerification> OrderVerifications { get; set; }

        public DbSet<UserOrderCancellation> UserOrderCancellations { get; set; }

        public DbSet<UserLimit> UserLimits { get; set; }

        public DbSet<GoldPrices> GoldPrices { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<ProductGoldShop> ProductGoldShops { get; set; }

        public DbSet<Notification> Notifications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>()
            .HasKey(x => new { x.UserId, x.RoleId });

            // Order → Buyer relation
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Buyer)
                .WithMany(u => u.BuyerOrders)
                .HasForeignKey(o => o.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order → Seller relation
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Seller)
                .WithMany(u => u.SellerOrders)
                .HasForeignKey(o => o.SellerId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<OrderVerification>()
            .HasOne(x => x.VerifiedByUser)
            .WithMany()
            .HasForeignKey(x => x.VerifiedByUserId)
            .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<UserLimit>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserRole>()
            .HasOne(x => x.User)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserOrderCancellation>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductGoldShop>()
            .HasKey(x => new { x.ProductId, x.GoldShopId });

            modelBuilder.Entity<ProductGoldShop>()
                .HasOne(x => x.Product)
                .WithMany(x => x.ProductGoldShops)
                .HasForeignKey(x => x.ProductId);

            modelBuilder.Entity<ProductGoldShop>()
                .HasOne(x => x.GoldShop)
                .WithMany(x => x.ProductGoldShops)
                .HasForeignKey(x => x.GoldShopId);


            // Seeds 

            // Add Roles
            modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" },
            new Role { Id = 3, Name = "GoldShop" }
        );


            // add test data in GoldPrices table 

            modelBuilder.Entity<GoldPrices>().HasData(
                new GoldPrices
                {
                    Id = 1,

                    Sell24K = 104.200m,
                    Buy24K = 100.000m,

                    Sell21K = 90.800m,
                    Buy21K = 86.400m,

                    Sell18K = 80.400m,
                    Buy18K = 73.900m,

                    SellLiraEnglish = 726.400m,
                    BuyLiraEnglish = 691.200m,

                    SellLiraRashadi = 635.600m,
                    BuyLiraRashadi = 604.800m,

                    CreatedAt = new DateTime(2026, 1, 1)
                }
            );


            // add Categories
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Name = "Rings",
                    ImageUrl = "rings.jpg",
                    Description = "Gold rings",
                    CreatedAt = new DateTime(2026, 1, 1)
                },
                new Category
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Name = "Necklaces",
                    ImageUrl = "necklaces.jpg",
                    Description = "Gold necklaces",
                    CreatedAt = new DateTime(2026, 1, 1)
                },
                new Category
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Name = "Bracelets",
                    ImageUrl = "bracelets.jpg",
                    Description = "Gold bracelets",
                    CreatedAt = new DateTime(2026, 1, 1)
                },
                new Category
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Name = "Gold Coins",
                    ImageUrl = "coins.jpg",
                    Description = "Gold coins / dinars",
                    CreatedAt = new DateTime(2026, 1, 1)
                },
                new Category
                {
                    Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Name = "Gold Bars",
                    ImageUrl = "bars.jpg",
                    Description = "Gold bullion bars",
                    CreatedAt = new DateTime(2026, 1, 1)
                }
            );

            // Add Admin

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    FullName = "Admin",
                    Email = "admin@goldmarket.com",
                    Phone = "0000000000",

                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),

                    IdentityImageUrl = "default-id.png",
                    ProfileImageUrl = "default-profile.png",
                    FaceImageUrl = "default-face.png",

                    IsActive = true,
                    VerificationStatus = VerificationStatus.Approved,
                    AcceptedTerms = true,
                    TermsAcceptedAt = new DateTime(2026, 1, 1),

                    CreatedAt = new DateTime(2026, 1, 1)
                }
            );

            // connecte the relation for admin

            modelBuilder.Entity<UserRole>().HasData(
            new UserRole
                {
                    UserId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    RoleId = 1
                }
            );


            // add shops to system 
            modelBuilder.Entity<GoldShop>().HasData(
                new GoldShop
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Al Amanah Gold Shop",
                    Phone = "0790000000",
                    LicenseNumber = "LIC-1001",
                    Address = "Amman - Downtown",
                    Latitude = 31.9539,
                    Longitude = 35.9106,
                    IsVerified = true,
                    CreatedAt = new DateTime(2026, 1, 1)
                },
                new GoldShop
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Al Quds Gold Shop",
                    Phone = "0791111111",
                    LicenseNumber = "LIC-1002",
                    Address = "Amman - Jabal Amman",
                    Latitude = 31.9454,
                    Longitude = 35.9284,
                    IsVerified = true,
                    CreatedAt = new DateTime(2026, 1, 1)
                }
            );

        }
    }
}
