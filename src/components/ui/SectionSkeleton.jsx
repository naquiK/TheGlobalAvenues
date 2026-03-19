export default function SectionSkeleton({ height = 'h-64' }) {
  return (
    <div
      className={`w-full ${height} bg-[#F5F3FF] dark:bg-[#1A1033] animate-pulse rounded-2xl max-w-7xl mx-auto my-4`}
    />
  );
}
