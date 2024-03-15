import { Route, Routes } from 'react-router-dom';
import WorldMap from './WorldMap';

import { FC } from 'react';
import { World } from '../domain/world';
import CityView from './CityView';

type Props = {
  world: World;
};

const MyRouter: FC<Props> = ({ world }) => {
  return (
    <Routes>
      <Route path="/" element={<WorldMap world={world} />} />
      <Route path="/city/:id" element={<CityView world={world} />} />
    </Routes>
  );
};

export default MyRouter;
