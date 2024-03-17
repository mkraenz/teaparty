import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import CityView from './CityView';
import WorldMap from './WorldMap';

const MyRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WorldMap />} />
      <Route path="/cities/:id" element={<CityView />} />
    </Routes>
  );
};

export default MyRouter;
