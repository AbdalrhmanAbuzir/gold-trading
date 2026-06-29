export default function Header() {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-white">

      <div>
        <h2 className="text-xl font-semibold text-gray-200">
          Admin Portal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#D4AF37] border border-amber-500/20 shadow-md shadow-amber-500/10 flex items-center justify-center font-bold text-slate-950">
          A
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-200">
            Administrator
          </p>
          <p className="text-[10px] text-amber-500 font-medium">
            Security Level 1
          </p>
        </div>
      </div>

    </header>
  );
}