import type { ProductStatus } from "../../types";

const styles: Record<ProductStatus, string> = {
  Available: "bg-green-100 text-green-800 border-green-300",
  Reserved: "bg-amber-100 text-amber-800 border-amber-300",
  Sold: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
