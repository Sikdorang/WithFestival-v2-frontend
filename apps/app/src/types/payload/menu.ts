export interface CreateMenuDto {
  name: string;
  price: number;
  description?: string;
  marginRate?: number;
  image?: File | null;
}
