import { Storage } from './storage';
import { Treasury } from './treasury';

export class Player {
  treasury: Treasury;
  storage: Storage;

  constructor(params: { treasury: Treasury; storage: Storage }) {
    this.treasury = params.treasury;
    this.storage = params.storage;
  }
}
