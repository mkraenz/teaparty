import { Heading } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { City as ICity } from '../../domain/city';
import { useConvoySelector } from '../SelectionProvider';
import SpeedSettings from '../common/SpeedSettings';
import { useConvoy, useWorld } from '../general/GameProvider';
import { usePathfinding } from '../hooks/usePathfinding';
import City from './City';
import Convoy from './Convoy';

const WorldMap: FC = () => {
  const world = useWorld();
  const selection = useConvoySelector();
  const { findPath } = usePathfinding();
  const convoy = useConvoy(selection.selected);
  const setConvoyTargetLandOrWater: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!convoy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // position within the map.
    const y = e.clientY - rect.top;

    const targetPos = { x, y };
    const path = findPath(convoy.pos, targetPos);
    if (!path) {
      convoy.halt();
      return;
    }
    convoy.setPath(path);
    convoy.setTarget({ pos: targetPos });
    if (convoy.dockedAt) convoy.undock();
  };
  const onCityContextMenu =
    (city: ICity): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (!convoy) return;
      if (convoy.dockedAt === city) return; // already docked. no need to move

      const targetPos = city.pos;
      const path = findPath(convoy.pos, targetPos);
      if (!path) {
        // arguably this shouldn't be possible by design of the map and its navmesh, but we might want to allow custom maps
        convoy.halt();
        return;
      }
      convoy.setPath(path);
      convoy.setTarget(city);
      if (convoy.dockedAt) convoy.undock();
    };
  return (
    <div>
      <SpeedSettings />
      <div
        style={{
          backgroundImage: 'url("/patrician2-map.jpg")',
          width: 639,
          height: 361,
          position: 'relative',
          // zoom: 2 // FIXME: not working with mouse click position, but browser zoom works
        }}
        onClick={() => selection.setSelected('')}
        onContextMenu={setConvoyTargetLandOrWater}
      >
        {world.citiesList.map((city) => {
          return (
            <City
              id={city.id}
              key={city.id}
              onContextMenu={onCityContextMenu(city)}
            />
          );
        })}
        {world.convoysList.map((convoy) => (
          <Convoy key={convoy.id} id={convoy.id} />
        ))}
      </div>
      {selection.selectedConvoy && (
        <Heading>Selected Convoy {selection.selectedConvoy.label}</Heading>
      )}
    </div>
  );
};

export default WorldMap;
