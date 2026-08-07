export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 font-black text-white shadow-lg shadow-red-500/30">
        D
      </div>

      <div>
        <h1 className="text-xl font-black tracking-wide text-white">
          DRAGON STUDIOS
        </h1>

        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
          Game Studio
        </p>
      </div>
    </div>
  );
}
