namespace GoldMarket.Helpers
{
    public static class FileHelper
    {
        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public static async Task<string> SaveImageAsync(
            IFormFile file,
            string folderPath)
        {
            if (file == null)
                throw new Exception("File is required.");

            if (file.Length == 0)
                throw new Exception("File is empty.");

            if (file.Length > MaxFileSize)
                throw new Exception("File size cannot exceed 5MB.");

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!AllowedExtensions.Contains(extension))
                throw new Exception("Only jpg, jpeg, png and webp files are allowed.");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{extension}";

            var fullPath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);

            await file.CopyToAsync(stream);

            return fileName;
        }
    }
}
