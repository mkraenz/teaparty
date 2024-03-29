export type Need = {
  ware: string;
  amount: number;
};

export type Product = {
  ware: string;
  /** amount of products produced per day */
  amount: number;
};

export type Point = {
  x: number;
  y: number;
};
