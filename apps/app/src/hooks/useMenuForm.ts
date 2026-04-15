import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useMenu } from './useMenu';

export const useMenuForm = (menuId: number) => {
  const { menus, updateMenu, updateMenuImage, createMenu, fetchMenu } =
    useMenu();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const existingMenu = menus.find((m) => m.id === menuId);
  const isNewMenu = menuId === 0;

  const [formData, setFormData] = useState({
    menu: '',
    description: '',
    price: '',
    margin: '',
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

  useEffect(() => {
    if (!isNewMenu && menus.length === 0) {
      fetchMenu();
    }
  }, [isNewMenu, menus.length]);

  useEffect(() => {
    if (isNewMenu) return;

    const existingMenu = menus.find((m) => m.id === menuId);

    if (existingMenu) {
      setFormData({
        menu: existingMenu.menu || '',
        description: existingMenu.description || '',
        price: existingMenu.price?.toString() || '',
        margin: existingMenu.margin?.toString() || '',
      });
      setImageState((prev) => ({
        ...prev,
        original: existingMenu.image || null,
      }));
    }
  }, [menus, menuId, isNewMenu]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImageState((prev) => ({
          ...prev,
          file,
          preview: reader.result as string,
        }));
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageState({ original: null, preview: null, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveMenu = async (isNew: boolean) => {
    const payload = {
      menu: formData.menu,
      description: formData.description,
      price: Number(formData.price),
      margin: Number(formData.margin),
    };

    if (isNew) {
      const newMenu = await createMenu(payload);
      if (newMenu && imageState.file)
        await updateMenuImage(newMenu.id, imageState.file);
    } else {
      await updateMenu(menuId, payload);
      if (imageState.file) await updateMenuImage(menuId, imageState.file);
      await fetchMenu();
    }
  };

  return {
    formData,
    imageState,
    fileInputRef,
    handleChange,
    handleImageChange,
    clearImage,
    saveMenu,
  };
};
