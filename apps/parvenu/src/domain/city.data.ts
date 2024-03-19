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
    pos: { x: 230, y: 290 },
    beggars: 200,
  },
  Gdansk: {
    id: 'Gdansk',
    label: 'Gdansk',
    pos: { x: 400, y: 260 },
  },
  Stockholm: {
    id: 'Stockholm',
    label: 'Stockholm',
    pos: { x: 400, y: 10 },
  },
  Edinburgh: {
    id: 'Edinburgh',
    label: 'Edinburgh',
    pos: { x: 6, y: 130 },
  },
  London: {
    id: 'London',
    label: 'London',
    pos: { x: 10, y: 310 },
  },
};
