import CtaButton from '@/components/common/buttons/CtaButton';
import TextArea from '@/components/common/inputs/TextArea';
import TextInput from '@/components/common/inputs/TextInput';
import { useState } from 'react';

interface Props {
  title: string;
  value: string;
  placeholder?: string;
  onSave: (newName: string) => void;
  isTextArea?: boolean;
}

export default function ManageBoothItem({
  title,
  value,
  placeholder = '내용을 입력해주세요.',
  onSave,
  isTextArea = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEditClick = () => {
    setInputValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="relative mb-4 rounded-2xl bg-white p-4">
      <h2 className="text-gray-500-80 mb-3 text-[14px] font-medium">{title}</h2>

      {isEditing ? (
        <div className="space-y-3">
          {isTextArea ? (
            <TextArea
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              limitHide
            />
          ) : (
            <TextInput
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              limitHide
            />
          )}
          <div className="flex w-full justify-end pt-2">
            <div className="w-1/3">
              <CtaButton
                text="입력 완료"
                color="yellow"
                size="small"
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-b-1">{value || '등록된 이름이 없습니다.'}</div>
          <div className="absolute top-3 right-4">
            <CtaButton
              text={value ? '수정하기' : '등록하기'}
              color="gray"
              size="small"
              width="fit"
              onClick={handleEditClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
