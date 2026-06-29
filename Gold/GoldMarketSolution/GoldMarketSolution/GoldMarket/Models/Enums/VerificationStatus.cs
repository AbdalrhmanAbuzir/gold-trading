namespace GoldMarket.Models.Enums
{
    public enum VerificationStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3
    }

    public enum OrderStatus
    {
        Reserved = 1,
        Completed = 2,
        Cancelled = 3,
        Expired = 4
    }

    public enum ProductStatus
    {
        Available = 1,
        Reserved = 2,
        Sold = 3,
        Hidden = 4
    }


}
