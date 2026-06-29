
using GoldMarket.Data;
using GoldMarket.Services.Auth;
using GoldMarket.Services.GoldShop;
using GoldMarket.Services.Notification;
using GoldMarket.Services.Order;
using GoldMarket.Services.Price;
using GoldMarket.Services.Product;
using GoldMarket.Services.Profile;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using GoldMarket.Middlewares;

namespace GoldMarket
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddScoped<IProductService, ProductService>();

            builder.Services.AddScoped<IOrderServices, OrderServices>();

            builder.Services.AddScoped<IGoldShopService, GoldShopService>();

            builder.Services.AddScoped<IProfileService, ProfileService>();

            builder.Services.AddScoped<IGoldPriceSyncService, GoldPriceSyncService>();

            builder.Services.AddScoped<INotificationService, NotificationService>();

            builder.Services.AddHostedService<OrderExpiryService>();

            builder.Services.AddHostedService<GoldPriceBackgroundService>();

            builder.Services.AddHttpClient();

            // JWT Authontication
            builder.Services.AddScoped<IAuthService, AuthService>();
            var jwt = builder.Configuration.GetSection("Jwt");

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwt["Issuer"],
                ValidAudience = jwt["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwt["Key"])
                )
            };
        });

            //builder.Services.AddAuthorization();

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly",
                    policy => policy.RequireRole("Admin"));

                options.AddPolicy("GoldShopOnly",
                    policy => policy.RequireRole("GoldShop"));

                options.AddPolicy("ApprovedUser",
                    policy => policy.RequireClaim("VerificationStatus", "Approved"));
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                builder.Configuration.GetConnectionString("DefaultConnection")
                )
            );


            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter JWT Token"
                });

                options.AddSecurityRequirement(
                    new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                    {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
                    });
            });


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });

            var app = builder.Build();

            app.UseCors("AllowReactApp");
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseGlobalException();

            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
