export interface ICategory {
  id: string;
  name: string;
  urlHandle: string;
  parent: {
    id: string;
    name: string;
  };
}

export interface IColor {
  id: string;
  name: string;
}

export interface IBrand {
  id: string;
  name: string;
}

export interface ISize {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  code: string;
  urlHandle: string;
  display: boolean;
  inventoryStatus: boolean;
  salePrice?: number;
  promotion?: number; //todo: check this
  metaDesc: string;
  originalPrice: number;
  category: ICategory | number;
  brand: IBrand | number;
  colors: IColor[] | number[];
  sizes: ISize[] | number[];
  variants: IVariant[] | number[];
  createdDate: Date;
  updatedDate: Date;
}

export interface IVariant {
  id: number;
  code: string;
  inventoryQuantity: number;
  instock: boolean;
  color: IColor | number;
  size: ISize | number;
  product?: IProduct | number;
}

export interface IPhoto {
  id: number;
  url: string;
  position: number;
  product: IProduct | number;
  color: IColor | number;
  createdDate: Date;
  updatedDate: Date;
}
