import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import CityDetails from './CityDetails';
import ConvoyDetails from './ConvoyDetails';
import WorldMap from './WorldMap';

const MyRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WorldMap />} />
      <Route path="/cities/:id" element={<CityDetails />} />
      <Route path="/convoys/:id" element={<ConvoyDetails />} />
    </Routes>
  );
};

export default MyRouter;
