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
    return waresData[ware].basePrice * 0.9 * amountTraded;
    // function(ware type, citizens consumption, wares in storage , city-owned production building consumption, (global availability of ware?? - not now), )
    // basePrice_type * fn(how many days do the current stocks satisfy total consumption)
  }

  getQuoteForSellingToMerchant(ware: string, amountTraded: number = 1) {
    return waresData[ware].basePrice * amountTraded;
  }

  canSellToMerchant(ware: string, amount: number = 1) {
    const inStock = this.cityStorage.hasResources([{ amount, ware }]);
    const price = this.getQuoteForSellingToMerchant(ware, amount);
    const merchantCanPay = this.merchantTreasury.hasEnough(price);
    return inStock && merchantCanPay;
  }

  canBuyFromMerchant(ware: string, amount: number = 1) {
    const inStock = this.merchantStorage.hasResources([{ amount, ware }]);
    // const cityCanPay = this.cityTreasury.hasEnough(this.getQuoteForBuyingFromMerchant(ware, amount)); // do we want to have finite money for what the city can buy? prolly not
    return inStock; // && cityCanPay;
  }

  sellToMerchant(ware: string, amount: number = 1) {
    const price = this.getQuoteForSellingToMerchant(ware, amount);
    if (this.canSellToMerchant(ware, amount)) {
      this.cityTreasury.debit(price);
      this.cityStorage.remove(ware, amount);
      this.merchantTreasury.credit(price);
      this.merchantStorage.add(ware, amount);
    }
  }

  buyFromMerchant(ware: string, amount: number = 1) {
    const price = this.getQuoteForBuyingFromMerchant(ware, amount);
    if (this.canBuyFromMerchant(ware, amount)) {
      this.merchantStorage.remove(ware, amount);
      this.cityStorage.add(ware, amount);
      this.cityTreasury.credit(price);
      this.merchantTreasury.debit(price);
    }
  }
}
