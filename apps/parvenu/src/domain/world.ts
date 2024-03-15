import { City } from './city';
import { Player } from './player';

export class World {
  cities: Record<string, City>;
  player: Player;
  day = 0;

  get citiesList() {
    return Object.values(this.cities);
  }

  constructor(params: { cities: Record<string, City>; player: Player }) {
    this.cities = params.cities;
    this.player = params.player;
  }

  passDay() {
    this.day++;
    this.citiesList.forEach((city) => city.passDay(this.day));
  }
}
