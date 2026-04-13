export default function MenuItemSkeleton() {
  return (
    <div className="w-fullitems-center flex animate-pulse py-4">
      <div className="flex-1 space-y-3 text-left">
        <div className="h-4 w-3/4 rounded bg-gray-100"></div>
        <div className="h-6 w-1/2 rounded bg-gray-100"></div>
      </div>
      <div className="h-60 w-60 rounded-2xl bg-gray-100"></div>
    </div>
  );
}
