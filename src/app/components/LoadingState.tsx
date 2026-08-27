export default function LoadingState({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar Skeleton */}
        <div className="bg-[#1e2a32] h-10" />

        {/* Header Skeleton */}
        <div className="bg-white py-4 px-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-1">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Nav Skeleton */}
        <div className="bg-white border-b px-6 py-3 flex gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-20 bg-gray-100 rounded" />
          ))}
        </div>

        {/* Hero Skeleton */}
        <div className="relative h-[500px] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 flex items-center px-12">
          <div className="space-y-4 max-w-2xl">
            <div className="h-6 w-48 bg-gray-300/50 rounded" />
            <div className="h-12 w-96 bg-gray-300/50 rounded" />
            <div className="h-4 w-80 bg-gray-300/50 rounded" />
            <div className="h-10 w-40 bg-[#f5c80c]/30 rounded" />
          </div>
        </div>

        {/* Catalog Skeleton */}
        <div className="py-16 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded mx-auto mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-16 bg-yellow-100 rounded" />
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
