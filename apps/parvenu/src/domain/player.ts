import { Storage } from './storage';
import { Treasury } from './treasury';

export class Player {
  readonly treasury: Treasury;
  readonly storage: Storage;

  constructor(params: { treasury: Treasury; storage: Storage }) {
    this.treasury = params.treasury;
    this.storage = params.storage;
  }
}
