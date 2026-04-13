import { handelError } from '@/apis/errorhandler';
import { menuAPI } from '@/apis/menu';
import { Menu } from '@/types/global';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SUCCESS_MESSAGES } from '../constants/message';
import { ROUTES } from '../constants/routes';
import { CreateMenuDto } from '../types/payload/menu';
import imageCompression from 'browser-image-compression';

export const useMenu = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchMenu = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await menuAPI.getMenu();
      setMenus(response.data);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createMenu = async (menu: CreateMenuDto): Promise<Menu | null> => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await menuAPI.createMenu(menu);
      toast.success(SUCCESS_MESSAGES.createMenuSuccess);
      return response.data;
    } catch (error) {
      handelError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenuImage = async (menuId: number) => {
    try {
      await menuAPI.deleteMenuImage(menuId);
      toast.success(SUCCESS_MESSAGES.deleteMenuImageSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenu = async (menuId: number, menu: CreateMenuDto) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await menuAPI.updateMenu(menuId, menu);
      toast.success(SUCCESS_MESSAGES.updateMenuSuccess);

      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenu = async (menuId: number) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await menuAPI.deleteMenu(menuId);

      navigate(ROUTES.STORE);
      toast.success(SUCCESS_MESSAGES.deleteMenuSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getMenuByUserId = async (userId: number) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await menuAPI.getMenuByUserId(userId);
      setMenus(response.data);

      return true;
    } catch (error) {
      handelError(error);
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
    setLoginError(null);

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

      await menuAPI.uploadToS3(presignedData.data.uploadUrl, compressedFile);

      const newImageUrl = presignedData.key;
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId ? { ...menu, image: newImageUrl } : menu,
        ),
      );

      toast.success(SUCCESS_MESSAGES.uploadMenuImageSuccess);
      return newImageUrl;
    } catch (error) {
      handelError(error);
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
    getMenuByUserId,
    isLoading,
    setIsLoading,
    loginError,
    setLoginError,
  };
};
