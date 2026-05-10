import { handelError } from '@/apis/errorhandler';
import { menuAPI } from '@/apis/menu';
import { ROUTES } from '@/constants/routes';
import { Menu } from '@/types/global';
import { CreateMenuDto } from '@/types/payload/menu';
import imageCompression from 'browser-image-compression';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SUCCESS_MESSAGES } from '../constants/message';

export const useMenu = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await menuAPI.getMenus();
      setMenus(response);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMenusByStoreId = useCallback(async (storeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await menuAPI.getMenusByStoreId(storeId);
      setMenus(response);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFormData = (menu: CreateMenuDto): FormData => {
    const formData = new FormData();
    formData.append('name', menu.name);
    if (menu.price !== undefined)
      formData.append('price', menu.price.toString());
    if (menu.marginRate !== undefined)
      formData.append('marginRate', menu.marginRate.toString());
    if (menu.description) formData.append('description', menu.description);
    if (menu.image) formData.append('image', menu.image);
    return formData;
  };

  const createMenu = async (menu: CreateMenuDto): Promise<Menu | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = createFormData(menu);
      const response = await menuAPI.createMenu(formData);
      toast.success(SUCCESS_MESSAGES.createMenuSuccess);
      return response;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenu = async (menuId: number, menu: CreateMenuDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = createFormData(menu);
      await menuAPI.updateMenu(menuId, formData);
      toast.success(SUCCESS_MESSAGES.updateMenuSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteMenuImage = async (menuId: number) => {
    try {
      await menuAPI.deleteMenuImage(menuId);
      toast.success(SUCCESS_MESSAGES.deleteMenuImageSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenu = async (menuId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await menuAPI.deleteMenu(menuId);
      toast.success(SUCCESS_MESSAGES.deleteMenuSuccess);
      navigate(ROUTES.STORE);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setMenuSoldOut = async (menuId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await menuAPI.setMenuSoldOut(menuId);
      toast.success('메뉴가 품절 처리되었습니다.');
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setMenuAvailable = async (menuId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await menuAPI.setMenuAvailable(menuId);
      toast.success('메뉴 판매가 재개되었습니다.');
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenuImage = async (
    menuId: number,
    imageFile: File,
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const fileName = imageFile.name + '.webp';
      const body = { fileName };

      const response = await menuAPI.getImageUploadUrl(menuId, body);
      const presignedData = response.data;

      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.75,
      });

      const uploadUrl = presignedData.data?.uploadUrl || presignedData.url;
      const newImageUrl = presignedData.data?.key || presignedData.key;

      await menuAPI.uploadToS3(uploadUrl, compressedFile);

      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId ? { ...menu, image: newImageUrl } : menu,
        ),
      );

      toast.success(SUCCESS_MESSAGES.uploadMenuImageSuccess);
      return newImageUrl;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    menus,
    fetchMenu,
    createMenu,
    deleteMenuImage,
    updateMenu,
    updateMenuImage,
    deleteMenu,
    getMenusByStoreId,
    setMenuSoldOut,
    setMenuAvailable,
    isLoading,
    error,
  };
};
