export interface Props {
  options: string[];
  selectedIndex: number; // 부모가 주입하는 현재 인덱스
  onChange: (index: number) => void; // 부모에게 변경을 알리는 함수
}

export function TabButton({
  options,
  selectedIndex,
  onChange,
}: Props) {
  return (
    <div className="relative flex w-full max-w-[320px] rounded-[18px] bg-gray-500-10 p-1.5">
      
      <div className="absolute inset-1.5">
        <div
          className="h-full rounded-xl bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
      </div>

      {options.map((option, index) => {
        const isActive = selectedIndex === index;
        return (
          <button
            key={option}
            onClick={() => onChange(index)}
            className={`relative z-10 flex-1 py-2 px-5 text-[12px] font-semibold transition-colors duration-200 ${
              isActive ? 'text-gray-500-90' : 'text-gray-500-40'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}