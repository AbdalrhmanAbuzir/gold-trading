namespace GoldMarket.DTOs
{
    public class ProductFilterDto
    {
        public string? Search { get; set; }

        public Guid? CategoryId { get; set; }

        public int? Karat { get; set; }

        public Guid? SellerId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public string? SortBy { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
