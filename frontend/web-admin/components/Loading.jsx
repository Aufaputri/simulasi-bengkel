export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center pb-2">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                    <div className="h-7 w-48 bg-slate-300 rounded-lg"></div>
                </div>
                <div className="h-10 w-40 bg-slate-200 rounded-xl"></div>
            </div>

            {/* Banner skeleton */}
            <div className="h-36 rounded-2xl bg-slate-200"></div>

            {/* Stat Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <div className="h-3 w-20 bg-slate-200 rounded"></div>
                            <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                        </div>
                        <div className="h-8 w-24 bg-slate-300 rounded-md"></div>
                        <div className="h-3 w-32 bg-slate-100 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="h-5 w-48 bg-slate-300 rounded-md"></div>
                <div className="space-y-3 pt-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-12 bg-slate-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
