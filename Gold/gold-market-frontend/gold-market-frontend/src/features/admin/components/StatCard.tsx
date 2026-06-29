type Props = {
  title: string;
  value: number | string;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-slate-950/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-slate-800/80 hover:border-amber-500/20 hover:shadow-amber-500/5 transition duration-300">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-extrabold text-amber-500 mt-2">
        {value}
      </p>
    </div>
  );
}