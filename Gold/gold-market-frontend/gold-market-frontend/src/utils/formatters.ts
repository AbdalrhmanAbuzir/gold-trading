function parseSafeDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // If it's a standard ISO datetime string without timezone info, append 'Z' to treat it as UTC
  const timePart = dateStr.split("T")[1];
  const hasTimezone = dateStr.endsWith("Z") || (timePart && (timePart.includes("+") || timePart.includes("-")));
  const formattedStr = hasTimezone ? dateStr : `${dateStr}Z`;
  return new Date(formattedStr);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return parseSafeDate(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return parseSafeDate(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeRemaining(expiresAt: string): string {
  if (!expiresAt) return "—";
  const diff = parseSafeDate(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${minutes}m remaining`;
}

