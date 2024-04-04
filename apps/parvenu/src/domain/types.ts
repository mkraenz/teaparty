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

type IProductionBuilding = {
  category: 'production';
  type: string;
  upkeepCost: number;
  products: { ware: string; amount: number }[];
  needs: { ware: string; amount: number }[];
  wagesPerWorkerPerDay: number;
  constructionCosts: {
    needs: { ware: string; amount: number }[];
    money: number;
  };
};
export type IBuilding = IProductionBuilding;
