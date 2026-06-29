interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 disabled:opacity-40 hover:bg-amber-50 transition-colors text-sm"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? "bg-amber-500 text-white"
              : "border border-amber-300 text-amber-700 hover:bg-amber-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 disabled:opacity-40 hover:bg-amber-50 transition-colors text-sm"
      >
        Next
      </button>
    </div>
  );
}
