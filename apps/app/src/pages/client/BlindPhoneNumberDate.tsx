import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import CtaButton from '@/components/common/buttons/CtaButton';
import { TabButton } from '@/components/common/buttons/TabButton';
import TextInput from '@/components/common/inputs/TextInput';
import BaseResponsiveLayout from '@/components/common/layouts/BaseResponsiveLayout';
import Navigator from '@/components/common/layouts/Navigator';
import AppearanceSlider from '@/components/pages/blindPhoneNumberDate/AppearanceSlider';
import MbtiSelector from '@/components/pages/blindPhoneNumberDate/MbtiSelector';
import { useDating } from '@/hooks/useDating';
import {
  createInFlightLock,
  LEADING_SUBMIT_OPTIONS,
  SUBMIT_GUARD_MS,
} from '@/shared/lib/idempotency';
import { TFunction } from 'i18next';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import DeleteConfirmModal from '../../components/common/modals/DeleteConfirmModal';

type MBTI = [string | null, string | null, string | null, string | null];

const getBlindDateSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t('customer.blindDate.validation.nameMin'))
      .max(20, t('customer.blindDate.validation.nameMax'))
      .regex(
        /^[가-힣a-zA-Z\s]+$/,
        t('customer.blindDate.validation.nameRegex'),
      ),
    age: z
      .string()
      .trim()
      .refine(
        (val) => /^\d+$/.test(val),
        t('customer.blindDate.validation.ageType'),
      )
      .refine(
        (val) => Number(val) >= 19 && Number(val) <= 39,
        t('customer.blindDate.validation.ageRange'),
      ),
    contact: z
      .string()
      .trim()
      .min(4, t('customer.blindDate.validation.contactMin'))
      .max(30, t('customer.blindDate.validation.contactMax'))
      .superRefine((val, ctx) => {
        if (val.startsWith('010')) {
          if (!/^010-\d{4}-\d{4}$/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('customer.blindDate.validation.contactFormatPhone'),
            });
            return;
          }

          const isFakeNumber = [
            /(\d{4})-\1/,
            /010-1234-5678/,
            /010-9876-5432/,
          ].some((regex) => regex.test(val));

          if (isFakeNumber) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('customer.blindDate.validation.contactFakePhone'),
            });
          }
        } else {
          if (!/^@?[a-zA-Z0-9_.]+$/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('customer.blindDate.validation.contactFormatGeneral'),
            });
          }
        }
      }),
    mbti: z
      .array(z.string().nullable())
      .length(4)
      .refine(
        (arr) => arr.every((val) => val !== null),
        t('customer.blindDate.validation.mbtiRequired'),
      ),
    deliveryPhone: z
      .string()
      .trim()
      .refine(
        (val) => /^010-\d{4}-\d{4}$/.test(val),
        t('customer.blindDate.validation.deliveryPhoneFormat'),
      ),
  });

export default function BlindPhoneNumberDate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createProfile, isLoading } = useDating();
  const submitLockRef = useRef(createInFlightLock());

  const GENDER_OPTIONS = [
    t('customer.blindDate.ui.genderMale'),
    t('customer.blindDate.ui.genderFemale'),
  ];

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    genderIndex: 0,
    contact: '',
    mbti: [null, null, null, null] as MBTI,
    appearance: 50,
    deliveryPhone: '',
  });

  const getAppearanceStep = (value: number) => {
    if (value <= 16) return 1;
    if (value <= 33) return 2;
    if (value <= 50) return 3;
    if (value <= 66) return 4;
    if (value <= 83) return 5;
    return 6;
  };

  const handlePhoneInput = (val: string) => {
    let formattedVal = val.replace(/[^0-9]/g, '');
    if (formattedVal.length > 3 && formattedVal.length <= 7) {
      formattedVal = formattedVal.replace(/(\d{3})(\d+)/, '$1-$2');
    } else if (formattedVal.length > 7) {
      formattedVal = formattedVal.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    }
    return formattedVal.slice(0, 13);
  };

  const handleSubmit = useDebouncedCallback(
    async () => {
      if (isLoading || !submitLockRef.current.tryAcquire()) return;

      const validation = getBlindDateSchema(t).safeParse(formData);

      if (!validation.success) {
        const firstErrorMessage = validation.error.issues[0].message;
        toast.error(firstErrorMessage);
        submitLockRef.current.release();
        return;
      }

      const payload = {
        name: formData.name,
        age: Number(formData.age),
        contact: formData.contact,
        mbti: formData.mbti.join(''),
        appearanceStyle: getAppearanceStep(formData.appearance),
        gender:
          formData.genderIndex === 0
            ? 'MALE'
            : ('FEMALE' as 'MALE' | 'FEMALE'),
        deliveryPhone: formData.deliveryPhone,
      };

      try {
        await createProfile(payload);
        toast.success(t('customer.blindDate.ui.toastSuccess'));
        navigate(-1);
      } catch (error) {
        console.error('프로필 등록 실패:', error);
        toast.error(t('customer.blindDate.ui.toastError'));
      } finally {
        submitLockRef.current.release();
      }
    },
    SUBMIT_GUARD_MS,
    LEADING_SUBMIT_OPTIONS,
  );

  return (
    <BaseResponsiveLayout>
      <Navigator
        left={<GoBackIcon />}
        onLeftPress={() => navigate(-1)}
        title={t('customer.blindDate.ui.title')}
      />

      <main className="flex flex-col gap-8 px-4 py-6 pb-24">
        <section className="relative flex flex-col gap-2 pt-4 pb-2">
          <div className="bg-primary-100 absolute -top-2 -right-4 h-20 w-20 animate-pulse rounded-full opacity-60 blur-2xl"></div>

          <h1 className="text-t-1 relative z-10 leading-[1.4] font-bold whitespace-pre-wrap">
            <span className="from-primary-500 bg-gradient-to-r to-pink-400 bg-clip-text text-transparent">
              {t('customer.blindDate.ui.headerHighlight')}
            </span>
            <span className="text-gray-800">
              {t('customer.blindDate.ui.headerRest')}
            </span>
            <span className="inline-block animate-[bounce_2s_infinite]">
              💖
            </span>
          </h1>

          <p className="text-b-2 relative z-10 text-gray-500">
            {t('customer.blindDate.ui.descPrefix')}
            <span className="text-primary-500 font-semibold">
              {t('customer.blindDate.ui.descHighlight')}
            </span>
            {t('customer.blindDate.ui.descSuffix')}
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <TextInput
            label={t('customer.blindDate.ui.nameLabel')}
            placeholder={t('customer.blindDate.ui.namePlaceholder')}
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            limitHide
          />

          <div className="flex items-end gap-4">
            <div className="w-1/3">
              <TextInput
                label={t('customer.blindDate.ui.ageLabel')}
                placeholder={t('customer.blindDate.ui.agePlaceholder')}
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
                {t('customer.blindDate.ui.genderLabel')}
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
            label={t('customer.blindDate.ui.contactLabel')}
            placeholder={t('customer.blindDate.ui.contactPlaceholder')}
            value={formData.contact}
            onChange={(e) => {
              let val = e.target.value;
              if (val.startsWith('010') && !val.includes('@')) {
                val = handlePhoneInput(val);
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
          gender={formData.genderIndex === 0 ? 'MALE' : 'FEMALE'}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, appearance: val }))
          }
        />

        <hr className="border-gray-100" />

        <section className="flex flex-col gap-2 pb-4">
          <TextInput
            label={t('customer.blindDate.ui.deliveryPhoneLabel')}
            placeholder={t('customer.blindDate.ui.deliveryPhonePlaceholder')}
            value={formData.deliveryPhone}
            onChange={(e) => {
              const formattedVal = handlePhoneInput(e.target.value);
              setFormData((prev) => ({ ...prev, deliveryPhone: formattedVal }));
            }}
            limitHide
          />
          <div className="mt-1 flex flex-col gap-1">
            <p className="text-[12px] text-gray-400">
              * {t('customer.blindDate.ui.deliveryPhoneNotice')}
            </p>
            <p className="text-[12px] text-gray-400">
              * {t('customer.blindDate.ui.noticeMultiple')}
            </p>
            <p className="text-[12px] text-gray-400">
              * {t('customer.blindDate.ui.noticeDelay')}
            </p>
          </div>
        </section>

        <DeleteConfirmModal
          title={t('customer.blindDate.ui.modalTitle')}
          description={t('customer.blindDate.ui.modalDesc')}
          cancelButtonText={t('customer.blindDate.ui.modalCancel')}
          confirmButtonText={t('customer.blindDate.ui.modalConfirm')}
          onConfirm={handleSubmit}
        >
          <CtaButton
            text={
              isLoading
                ? t('customer.blindDate.ui.submitLoading')
                : t('customer.blindDate.ui.submitDefault')
            }
            disabled={isLoading}
            isLoading={isLoading}
            radius="_2xl"
          />
        </DeleteConfirmModal>
      </main>
    </BaseResponsiveLayout>
  );
}
