import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { TabButton } from '@/components/common/buttons/TabButton';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import AppearanceSlider from '@/components/pages/blindPhoneNumberDate/AppearanceSlider';
import MbtiSelector from '@/components/pages/blindPhoneNumberDate/MbtiSelector';
import { useDating } from '@/hooks/useDating';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import DeleteConfirmModal from '../../components/common/modals/DeleteConfirmModal';

type MBTI = [string | null, string | null, string | null, string | null];

const GENDER_OPTIONS = ['남성', '여성'];

const blindDateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(20, '이름은 최대 20자까지 가능합니다.')
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      '이름은 한글과 영문만 입력 가능합니다. (특수문자, 숫자, 이모지 불가)',
    ),
  age: z
    .string()
    .trim()
    .refine((val) => /^\d+$/.test(val), '나이는 숫자만 입력해야 합니다.')
    .refine(
      (val) => Number(val) >= 19 && Number(val) <= 39,
      '대학생 및 청년층(19세~39세)만 참여 가능합니다.',
    ),
  contact: z
    .string()
    .trim()
    .min(4, '연락처를 입력해주세요.')
    .max(30, '연락처 길이가 초과되었습니다.')
    .superRefine((val, ctx) => {
      if (val.startsWith('010')) {
        if (!/^010-\d{4}-\d{4}$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              '전화번호는 010-XXXX-XXXX 형식으로 하이픈(-)을 포함해 13자리로 입력해주세요.',
          });
          return;
        }

        // 악성/가짜 번호 패턴 필터링
        const isFakeNumber = [
          /(\d{4})-\1/, // 앞뒤 4자리가 완전히 동일한 경우 (예: 1234-1234, 1111-1111 등)
          /010-1234-5678/,
          /010-9876-5432/,
        ].some((regex) => regex.test(val));

        if (isFakeNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              '사용할 수 없는 전화번호 패턴입니다. 실제 번호를 입력해주세요.',
          });
        }
      } else {
        if (!/^@?[a-zA-Z0-9_.]+$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              '올바른 전화번호(010-...) 또는 인스타그램 아이디(@...)를 입력해주세요.',
          });
        }
      }
    }),
  mbti: z
    .array(z.string().nullable())
    .length(4)
    .refine(
      (arr) => arr.every((val) => val !== null),
      'MBTI 4자리를 모두 선택해주세요.',
    ),
});

export default function BlindPhoneNumberDate() {
  const navigate = useNavigate();
  const { createProfile, isLoading } = useDating();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    genderIndex: 0,
    contact: '',
    mbti: [null, null, null, null] as MBTI,
    appearance: 50,
  });

  const getAppearanceStep = (value: number) => {
    if (value <= 16) return 1;
    if (value <= 33) return 2;
    if (value <= 50) return 3;
    if (value <= 66) return 4;
    if (value <= 83) return 5;
    return 6;
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const validation = blindDateSchema.safeParse(formData);

    if (!validation.success) {
      const firstErrorMessage = validation.error.issues[0].message;
      toast.error(firstErrorMessage);
      return;
    }

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      contact: formData.contact,
      mbti: formData.mbti.join(''),
      appearanceStyle: getAppearanceStep(formData.appearance),
      gender:
        formData.genderIndex === 0 ? 'MALE' : ('FEMALE' as 'MALE' | 'FEMALE'),
      deliveryPhone: formData.contact,
    };

    try {
      await createProfile(payload);
      toast.success('프로필 등록이 완료되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('프로필 등록 실패:', error);
      toast.error('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title="축제 즉석 번호팅"
      />

      <main className="flex flex-col gap-8 px-4 py-6 pb-24">
        <section className="relative flex flex-col gap-2 pt-4 pb-2">
          <div className="bg-primary-100 absolute -top-2 -right-4 h-20 w-20 animate-pulse rounded-full opacity-60 blur-2xl"></div>

          <h1 className="text-t-1 relative z-10 leading-[1.4] font-bold whitespace-pre-wrap">
            <span className="from-primary-500 bg-gradient-to-r to-pink-400 bg-clip-text text-transparent">
              대학 축제
            </span>
            <span className="text-gray-800">에서</span>
            <br />
            <span className="text-gray-800">운명적인 만남을 </span>
            <span className="inline-block animate-[bounce_2s_infinite]">
              💖
            </span>
          </h1>

          <p className="text-b-2 relative z-10 text-gray-500">
            내부적으로 매칭이 되면{' '}
            <span className="text-primary-500 font-semibold">DM</span> 또는{' '}
            <span className="text-primary-500 font-semibold">SMS</span>로
            알려드려요 !
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <TextInput
            label="이름"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            limitHide
          />

          <div className="flex items-end gap-4">
            <div className="w-1/3">
              <TextInput
                label="나이"
                placeholder="나이"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                limitHide
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <span className="text-[14px] font-medium text-gray-700">
                성별
              </span>
              <TabButton
                options={GENDER_OPTIONS}
                selectedIndex={formData.genderIndex}
                onChange={(index) =>
                  setFormData((prev) => ({ ...prev, genderIndex: index }))
                }
              />
            </div>
          </div>

          <TextInput
            label="연락처"
            placeholder="전화번호 또는 @인스타그램"
            value={formData.contact}
            onChange={(e) => {
              let val = e.target.value;

              if (val.startsWith('010') && !val.includes('@')) {
                val = val.replace(/[^0-9]/g, '');

                if (val.length > 3 && val.length <= 7) {
                  val = val.replace(/(\d{3})(\d+)/, '$1-$2');
                } else if (val.length > 7) {
                  val = val.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
                }

                val = val.slice(0, 13);
              }

              setFormData((prev) => ({ ...prev, contact: val }));
            }}
            limitHide
          />
        </section>

        <hr className="border-gray-100" />

        <MbtiSelector
          value={formData.mbti}
          onChange={(newMbti) =>
            setFormData((prev) => ({ ...prev, mbti: newMbti }))
          }
        />

        <hr className="border-gray-100" />

        <AppearanceSlider
          value={formData.appearance}
          gender={formData.genderIndex === 0 ? 'MALE' : 'FEMALE'} // 💡 성별 Prop 전달
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, appearance: val }))
          }
        />

        <DeleteConfirmModal
          title={'프로필을 등록할까요?'}
          description={
            '한번 신청하면 24시간 동안 재등록이 불가해요.\n입력하신 정보가 올바른지 꼭 확인해주세요 !'
          }
          cancelButtonText={'돌아가기'}
          confirmButtonText={'등록하기'}
          onConfirm={handleSubmit}
        >
          <CtaButton
            text={isLoading ? '등록 중...' : '프로필 등록하기'}
            disabled={isLoading}
            radius="_2xl"
          />
        </DeleteConfirmModal>
      </main>
    </BaseResponsiveLayout>
  );
}
