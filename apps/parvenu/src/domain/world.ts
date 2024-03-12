import { City } from './city';
import { Player } from './player';

export class World {
  cities: Record<string, City>;
  player: Player;

  get citiesList() {
    return Object.values(this.cities);
  }

  constructor(params: { cities: Record<string, City>; player: Player }) {
    this.cities = params.cities;
    this.player = params.player;
  }

  passDay(date: number) {
    this.citiesList.forEach((city) => city.passDay(date));
  }
}
