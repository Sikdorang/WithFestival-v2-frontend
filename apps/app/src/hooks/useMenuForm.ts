import { CreateMenuDto } from '@/types/payload/menu';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMenu } from './useMenu';

export const useMenuForm = (menuId: number) => {
  const { menus, updateMenu, createMenu, fetchMenu } = useMenu();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isNewMenu = menuId === 0;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    marginRate: '',
  });

  const [imageState, setImageState] = useState<{
    original: string | null;
    preview: string | null;
    file: File | null;
  }>({
    original: null,
    preview: null,
    file: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewMenu && menus.length === 0) {
      fetchMenu();
    }
  }, [isNewMenu, menus.length, fetchMenu]);

  useEffect(() => {
    if (isNewMenu) return;

    const existingMenu = menus.find((m) => m.id === menuId);

    if (existingMenu) {
      setFormData({
        name: existingMenu.name || '',
        description: existingMenu.description || '',
        price: existingMenu.price?.toString() || '',
        marginRate: existingMenu.marginRate?.toString() || '',
      });
      setImageState((prev) => ({
        ...prev,
        original: existingMenu.imageUrl || null,
      }));
    }
  }, [menus, menuId, isNewMenu]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('지원하지 않는 형식입니다. (jpg, jpeg, png, webp, gif)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (file.size > MAX_SIZE) {
      toast.error('이미지 크기가 너무 큽니다. (최대 10MB)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      setImageState((prev) => ({
        ...prev,
        file,
        preview: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageState({ original: null, preview: null, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveMenu = async () => {
    if (!formData.name || !formData.price) {
      toast.error('메뉴명과 가격은 필수입니다.');
      return false;
    }

    setIsSaving(true);
    try {
      const payload: CreateMenuDto = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        marginRate: Number(formData.marginRate),
        image: imageState.file,
      };

      if (isNewMenu) {
        await createMenu(payload);
      } else {
        await updateMenu(menuId, payload);
        await fetchMenu();
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    imageState,
    fileInputRef,
    isNewMenu,
    isSaving,
    handleChange,
    handleImageChange,
    clearImage,
    saveMenu,
  };
};
