import { useState } from 'react';
import TextInput from '@/components/common/inputs/TextInput';
import CtaButton from '@/components/common/buttons/CtaButton';
import TextArea from '@/components/common/inputs/TextArea';

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
    <div className="relative mb-4 rounded-2xl bg-gray-100 p-4 shadow-md">
      <h2 className="text-st-2 mb-3">{title}</h2>

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
          <div className="flex justify-end gap-2">
            <CtaButton
              text="취소"
              color="white"
              size="small"
              onClick={handleCancel}
            />
            <CtaButton
              text="저장"
              color="green"
              size="small"
              onClick={handleSave}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="text-b-1">{value || '등록된 이름이 없습니다.'}</div>
          <div className="absolute top-3 right-4">
            <CtaButton
              text={value ? '수정하기' : '등록하기'}
              color="white"
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
