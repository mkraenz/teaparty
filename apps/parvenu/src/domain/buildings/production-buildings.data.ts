export const productionBuildings = {
  brewery: {
    type: 'brewery',
    upkeepCost: 200,
    products: [{ ware: 'beer', amount: 8 }],
    needs: [{ ware: 'grain', amount: 1 }],
    wagesPerWorkerPerDay: 10,
    setupCosts: {
      needs: [{ ware: 'wood', amount: 80 }],
      money: 1200,
    },
  },
  grainFarm: {
    type: 'grainFarm',
    upkeepCost: 50,
    products: [{ ware: 'grain', amount: 16 }],
    needs: [],
    wagesPerWorkerPerDay: 10,
    setupCosts: {
      needs: [{ ware: 'wood', amount: 60 }],
      money: 1000,
    },
  },
  woodcutter: {
    type: 'woodcutter',
    upkeepCost: 50,
    products: [{ ware: 'wood', amount: 6 }],
    needs: [],
    wagesPerWorkerPerDay: 10,
    setupCosts: {
      needs: [
        {
          ware: 'wood',
          amount: 60,
        },
      ],
      money: 1000,
    },
  },
};
