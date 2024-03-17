import { Point } from './types';

type CityData = {
  id: string;
  label: string;
  pos: Point;
  beggars?: number;
};

export const cityData: { [cityName: string]: CityData } = {
  Hamburg: {
    id: 'hamburg',
    label: 'Hamburg',
    pos: { x: 535, y: 666 },
    beggars: 200,
  },
  Gdansk: {
    id: 'Gdansk',
    label: 'Gdansk',
    pos: { x: 905, y: 603 },
  },
  Stockholm: {
    id: 'Stockholm',
    label: 'Stockholm',
    pos: { x: 905, y: 133 },
  },
  Edinburgh: {
    id: 'Edinburgh',
    label: 'Edinburgh',
    pos: { x: 81, y: 290 },
  },
  London: {
    id: 'London',
    label: 'London',
    pos: { x: 115, y: 700 },
  },
};
