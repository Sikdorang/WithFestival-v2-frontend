'use client';

import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import Navigator from '@/components/common/layouts/Navigator';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CtaButton from '../../components/common/buttons/CtaButton';
import TextArea from '../../components/common/inputs/TextArea';
import { ROUTES } from '../../constants/routes';

interface GeneratedMenu {
  id: string;
  name: string;
  description: string;
  priceEstimate: string;
}

export default function AiMenuGenerator() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<string[]>(['']);
  const [concept, setConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [isLocked, setIsLocked] = useState(false);
  const [result, setResult] = useState<GeneratedMenu[]>([]);

  const handleMenuChange = (index: number, value: string) => {
    const newMenus = [...menus];
    newMenus[index] = value;
    setMenus(newMenus);
  };

  const addMenuInput = () => setMenus([...menus, '']);

  const removeMenuInput = (index: number) => {
    if (menus.length > 1) {
      setMenus(menus.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    const hasEmptyMenu = menus.some((m) => m.trim() === '');

    if (hasEmptyMenu) {
      alert('입력되지 않은 메뉴가 있습니다. 빈 칸을 채우거나 삭제해주세요.');
      return;
    }

    if (!concept.trim()) {
      alert('부스 컨셉을 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = menus.map((name, i) => ({
      id: `menu-${i}`,
      name: name,
      description: `${concept} 감성을 듬뿍 담아 완성한, 입안 가득 퍼지는 환상적인 ${name}`,
      priceEstimate: '추천 가격: 4,000원 ~ 6,000원',
    }));

    setResult(mockResult);
    setIsGenerating(false);
    setIsLocked(true);
    navigate(ROUTES.STORE);
  };

  return (
    <div>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="예약 관리"
      />

      <div className="mx-auto w-full max-w-2xl bg-white p-4 py-12 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#11153F] md:text-3xl">
            AI 메뉴판 생성
          </h2>
          <p className="mt-2 text-gray-500">
            판매할 메뉴와 부스 분위기를 알려주세요.
          </p>
        </div>

        <div className="bg-primary-300-10 mb-8 rounded-2xl p-5 text-[#1C58D9]">
          <div className="flex items-center gap-2 font-bold">
            <span>💡</span>
            <span>생성 안내</span>
          </div>
          <p className="mt-1 text-sm opacity-90">
            AI를 통한 <strong>메뉴 설명과 이미지 생성</strong>은{' '}
            <strong>부스당 최초 1회만 제공</strong>됩니다. 신중하게 입력해
            주세요. 생성 후 세부 내용은 직접 수정할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-8 rounded-[32px] bg-white p-6 md:p-8">
          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-[#11153F]">
              1. 어떤 메뉴를 판매하시나요?
            </label>
            <div className="flex flex-col gap-2">
              {menus.map((menu, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="예: 눈꽃 치즈 떡볶이"
                    value={menu}
                    onChange={(e) => handleMenuChange(index, e.target.value)}
                    disabled={isLocked || isGenerating}
                    className="w-full rounded-xl bg-gray-100 px-4 py-3 text-base transition-colors outline-none focus:bg-gray-200 disabled:opacity-50"
                  />
                  <button
                    onClick={() => removeMenuInput(index)}
                    disabled={menus.length === 1 || isLocked || isGenerating}
                    className="shrink-0 rounded-xl bg-gray-100 px-4 font-bold text-gray-400 transition-colors hover:bg-gray-200 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {!isLocked && (
              <div className="flex w-full justify-end">
                <CtaButton
                  text={'+ 메뉴 추가하기'}
                  onClick={addMenuInput}
                  width="fit"
                  size="small"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-[#11153F]">
              2. 부스의 컨셉이나 분위기는요?
            </label>
            <TextArea
              placeholder={
                '예: 90년대 홍콩 누아르 분위기, 무섭고 오싹한 귀신의 집'
              }
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              limitHide
            />
          </div>

          <CtaButton
            text={
              isGenerating
                ? 'AI가 카피를 작성하는 중...'
                : isLocked
                  ? 'AI 자동 생성 완료'
                  : 'AI 메뉴판 생성하기'
            }
            onClick={handleGenerate}
            disabled={isLocked || isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
