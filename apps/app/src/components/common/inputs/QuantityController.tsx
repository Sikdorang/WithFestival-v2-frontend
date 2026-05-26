interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

export default function QuantityController({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
}: Props) {
  return (
    <div className="bg-gray-500-10 flex items-center rounded-lg p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="flex h-8 w-8 items-center justify-center text-gray-500 transition-opacity disabled:opacity-30"
      >
        <span className="text-lg font-medium">−</span>
      </button>

      <div className="text-gray-500-90 flex h-8 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold">
        {quantity}
      </div>

      <button
        type="button"
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center text-gray-500 transition-opacity"
      >
        <span className="text-lg font-medium">+</span>
      </button>
    </div>
  );
}
