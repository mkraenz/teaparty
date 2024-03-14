import { Storage } from '../storage';
import { Treasury } from '../treasury';
import { Building } from './building';

export class CountingHouse extends Building {
  readonly storage: Storage;
  readonly treasury: Treasury;

  constructor(params: { storage: Storage; owner: string; treasury: Treasury }) {
    super({ type: 'counting-house', owner: params.owner });
    this.storage = params.storage;
    this.treasury = params.treasury;
  }

  destroy() {
    // do nothing for now
  }
}
