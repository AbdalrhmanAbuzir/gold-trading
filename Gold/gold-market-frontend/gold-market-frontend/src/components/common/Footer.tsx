export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏅</span>
          <span className="text-white font-semibold">GoldMarket</span>
          <span className="text-gray-500">— Trusted Gold Trading Platform</span>
        </div>
        <p className="text-gray-500">© {new Date().getFullYear()} GoldMarket. All rights reserved.</p>
      </div>
    </footer>
  );
}
