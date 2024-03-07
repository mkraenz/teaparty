import { Citizens } from './citizens';
import { Storage } from './storage';
import { Treasury } from './treasury';
import { waresData } from './wares.data';

export class TradingPost {
  private readonly cityStorage: Storage;
  private readonly cityTreasury: Treasury;
  private readonly citizens: Citizens;
  private merchantStorage!: Storage;
  private merchantTreasury!: Treasury;

  constructor(params: {
    cityStorage: Storage;
    cityTreasury: Treasury;
    citizens: Citizens;
  }) {
    this.cityStorage = params.cityStorage;
    this.cityTreasury = params.cityTreasury;
    this.citizens = params.citizens;
  }

  setMerchant(merchant: { storage: Storage; treasury: Treasury }) {
    this.merchantStorage = merchant.storage;
    this.merchantTreasury = merchant.treasury;
  }

  getQuoteForBuyingFromMerchant(ware: string, amountTraded: number = 1) {
    return waresData[ware].basePrice * 0.9;
    // function(ware type, citizens consumption, wares in storage , city-owned production building consumption, (global availability of ware?? - not now), )
    // basePrice_type * fn(how many days do the current stocks satisfy total consumption)
  }

  getQuoteForSellingToMerchant(ware: string, amountTraded: number = 1) {
    return waresData[ware].basePrice;
  }
}
