export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center">
        <div className="text-6xl mb-4">🏅</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About GoldMarket</h1>
        <p className="text-gray-600 text-lg">
          A trusted marketplace that connects gold buyers, sellers, and verified gold shops.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          GoldMarket provides a secure, transparent, and efficient platform for gold trading.
          We bridge the gap between individual sellers and buyers through a network of certified
          gold shops, ensuring every transaction is safe, price-locked, and physically verified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "🔒", title: "Price Locked", desc: "Order prices are locked at creation time — no surprises." },
          { icon: "✅", title: "Verified Shops", desc: "All gold shops are certified and verified by our team." },
          { icon: "⏱️", title: "48-Hour Window", desc: "Complete your transaction within 48 hours for security." },
        ].map((item) => (
          <div key={item.title} className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
