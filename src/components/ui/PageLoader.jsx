export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0D0A1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#F5F3FF] border-t-[#E8521A] animate-spin" />
        <p className="text-sm text-[#2D1B69]/50 dark:text-white/30 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
