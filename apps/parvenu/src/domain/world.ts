import { City } from './city';
import { Convoy } from './convoy';
import { Player } from './player';

export class World {
  cities: Record<string, City>;
  convoys: Record<string, Convoy>;
  player: Player;
  /** one second outgame is one day ingame. */
  totaltime = 0;

  get day() {
    return Math.floor(this.totaltime / 1000);
  }

  get citiesList() {
    return Object.values(this.cities);
  }

  get convoysList() {
    return Object.values(this.convoys);
  }

  constructor(params: {
    cities: Record<string, City>;
    player: Player;
    convoys: Record<string, Convoy>;
  }) {
    this.cities = params.cities;
    this.player = params.player;
    this.convoys = params.convoys;
  }

  passDay() {
    this.citiesList.forEach((city) => city.passDay(this.day));
  }

  passTime(delta: number) {
    if (delta === 0) return;
    this.totaltime += delta;
    this.convoysList.forEach((convoy) => convoy.passTime(delta));
  }

  isToday(day: number) {
    return this.day === day;
  }

  addConvoy(convoy: Convoy) {
    this.convoys[convoy.id] = convoy;
  }
}
