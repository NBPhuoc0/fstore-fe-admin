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
