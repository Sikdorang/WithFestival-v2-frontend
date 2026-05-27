import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface AppearanceSliderProps {
  value: number;
  gender: 'MALE' | 'FEMALE';
  onChange: (value: number) => void;
}

const ANCHOR_POINTS = [0, 20, 40, 60, 80, 100];

import presentMale1 from '@/assets/images/profile/present_male_1.jpg';
import presentMale2 from '@/assets/images/profile/present_male_2.webp';
import presentMale3 from '@/assets/images/profile/present_male_3.webp';
import presentMale4 from '@/assets/images/profile/present_male_4.webp';
import presentMale5 from '@/assets/images/profile/present_male_5.webp';
import presentMale6 from '@/assets/images/profile/present_male_6.jpg';

import presentFemale1 from '@/assets/images/profile/present_female_1.jpeg';
import presentFemale2 from '@/assets/images/profile/present_female_2.webp';
import presentFemale3 from '@/assets/images/profile/present_female_3.webp';
import presentFemale4 from '@/assets/images/profile/present_female_4.webp';
import presentFemale5 from '@/assets/images/profile/present_female_5.jpg';
import presentFemale6 from '@/assets/images/profile/present_female_6.webp';

const CELEB_DATA = {
  FEMALE: [
    { name: '수빈', img: presentMale1 },
    { name: '임시완', img: presentMale2 },
    { name: '변우석', img: presentMale3 },
    { name: '현진', img: presentMale4 },
    { name: '뷔', img: presentMale5 },
    { name: '신현준', img: presentMale6 },
  ],
  MALE: [
    { name: '다현', img: presentFemale1 },
    { name: '윈터', img: presentFemale2 },
    { name: '고윤정', img: presentFemale3 },
    { name: '닝닝', img: presentFemale4 },
    { name: '전소미', img: presentFemale5 },
    { name: '지효', img: presentFemale6 },
  ],
};

export default function AppearanceSlider({
  value,
  gender,
  onChange,
}: AppearanceSliderProps) {
  const { t } = useTranslation();

  const getAppearanceLabel = (val: number) => {
    if (val < 10) return t('customer.blindDate.appearance.types.step1');
    if (val < 30) return t('customer.blindDate.appearance.types.step2');
    if (val < 50) return t('customer.blindDate.appearance.types.step3');
    if (val < 70) return t('customer.blindDate.appearance.types.step4');
    if (val < 90) return t('customer.blindDate.appearance.types.step5');
    return t('customer.blindDate.appearance.types.step6');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const currentCelebs = CELEB_DATA[gender];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-bold text-gray-800">
          {t('customer.blindDate.appearance.title')}
        </span>
        <span className="text-primary-500 text-[14px] font-bold">{value}</span>
      </div>

      <div className="relative mx-auto mt-2 h-36 w-36 overflow-hidden rounded-full bg-gray-100 shadow-inner">
        {currentCelebs.map((celeb, index) => {
          const anchor = ANCHOR_POINTS[index];
          const opacity = Math.max(0, 1 - Math.abs(value - anchor) / 20);

          return (
            <img
              key={celeb.name}
              src={celeb.img}
              alt={celeb.name}
              className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
              style={{
                opacity: opacity,
                transform: 'translateZ(0)',
              }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[12px] text-gray-500">
        <span>{t('customer.blindDate.appearance.minLabel')}</span>
        <span>{t('customer.blindDate.appearance.maxLabel')}</span>
      </div>

      <div className="relative w-full py-2">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="accent-primary-500 h-2 w-full appearance-none rounded-lg bg-gray-200"
        />
      </div>

      <div className="rounded-xl bg-gray-50 py-3 text-center text-[14px] font-medium text-gray-700 transition-all">
        {getAppearanceLabel(value)}
      </div>
    </section>
  );
}
