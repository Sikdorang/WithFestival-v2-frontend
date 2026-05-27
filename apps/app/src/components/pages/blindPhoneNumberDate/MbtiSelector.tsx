import { useTranslation } from 'react-i18next';

interface MbtiSelectorProps {
  value: [string | null, string | null, string | null, string | null];
  onChange: (
    value: [string | null, string | null, string | null, string | null],
  ) => void;
}

export default function MbtiSelector({ value, onChange }: MbtiSelectorProps) {
  const { t } = useTranslation();

  const handleSelect = (index: number, selectedValue: string) => {
    const newMbti = [...value] as [
      string | null,
      string | null,
      string | null,
      string | null,
    ];
    newMbti[index] = selectedValue;
    onChange(newMbti);
  };

  const MBTI_OPTIONS = [
    { label: t('customer.blindDate.mbti.energy'), top: 'E', bottom: 'I' },
    { label: t('customer.blindDate.mbti.perception'), top: 'N', bottom: 'S' },
    { label: t('customer.blindDate.mbti.judgment'), top: 'T', bottom: 'F' },
    { label: t('customer.blindDate.mbti.lifestyle'), top: 'J', bottom: 'P' },
  ];

  return (
    <section className="flex flex-col gap-4">
      <span className="text-[14px] font-bold text-gray-800">MBTI</span>
      <div className="flex justify-between gap-2">
        {MBTI_OPTIONS.map((option, index) => (
          <div key={index} className="flex flex-1 flex-col gap-2">
            <span className="text-center text-[12px] text-gray-400">
              {option.label}
            </span>
            <button
              type="button"
              onClick={() => handleSelect(index, option.top)}
              className={`rounded-lg border py-3 text-[16px] font-bold transition-colors ${
                value[index] === option.top
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {option.top}
            </button>
            <button
              type="button"
              onClick={() => handleSelect(index, option.bottom)}
              className={`rounded-lg border py-3 text-[16px] font-bold transition-colors ${
                value[index] === option.bottom
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {option.bottom}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
