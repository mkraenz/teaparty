import { Building } from './building';

export class Shipyard extends Building {
  constructor(params: { owner: string }) {
    super({ type: 'shipyard', owner: params.owner });
  }

  destroy() {
    // do nothing for now
  }
}

export function isShipyard(building: unknown): building is Shipyard {
  return (
    typeof building === 'object' &&
    building !== null &&
    'type' in building &&
    building.type === 'shipyard'
  );
}
