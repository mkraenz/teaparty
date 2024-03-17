import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import CityDetails from './CityDetails';
import ConvoyDetails from './ConvoyDetails';
import { SelectionProvider } from './SelectionProvider';
import WorldMap from './WorldMap';

const MyRouter: FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SelectionProvider>
            <WorldMap />
          </SelectionProvider>
        }
      />
      <Route path="/cities/:id" element={<CityDetails />} />
      <Route path="/convoys/:id" element={<ConvoyDetails />} />
    </Routes>
  );
};

export default MyRouter;
