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
  inventory: IInventory;
  color: IColor | number;
  size: ISize | number;
  product?: IProduct | number;
}

export interface IInventory {
  id: number;
  variantId: number;
  stockQuantity: number;
  createdDate: Date;
  updatedDate: Date;
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

export interface IVoucher {
  id: number;
  name: string;
  status: boolean;
  description: string;
  type: "PERCENT" | "AMOUNT";
  maxDiscount: number;
  value: number;
  image: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface IOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdDate: Date;
  updatedDate: Date;
  // products?: IProduct[] | number[];
  items?: IOrderItem[] | number[];
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: number;
  quantity: number;
  price: number;
  createdDate: Date;
  updatedDate: Date;
}

export interface ITicket {
  id: string;
  email: string;
  orderId: number | null;
  type: TicketType;
  status: TicketStatus;
  customerNote: string;
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}
export enum TicketType {
  RETURNED = "RETURNED",
  EXCHANGE = "EXCHANGE",
  COMPLAINT = "COMPLAINT",
  OTHERS = "OTHERS",
}

export enum TicketStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DELIVERING = "DELIVERING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  RETURN_PROCESSING = "RETURN_PROCESSING",
  RETURNED = "RETURNED",
  EXCHANGED = "EXCHANGED",
  WAITING_REFUND = "WAITING_REFUND",
}
