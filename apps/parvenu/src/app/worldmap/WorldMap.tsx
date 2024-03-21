import { Heading } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { useConvoySelector } from '../SelectionProvider';
import SpeedSettings from '../common/SpeedSettings';
import { useConvoy, useWorld } from '../general/GameProvider';
import { usePathfinding } from '../hooks/usePathfinding';
import City from './City';
import Convoy from './Convoy';

const WorldMap: FC = () => {
  const world = useWorld();
  const selection = useConvoySelector();
  const { findPath, navmesh } = usePathfinding();
  const convoy = useConvoy(selection.selected);
  const setConvoyTarget: MouseEventHandler<HTMLDivElement> = (e) => {
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.
    console.log({ x, y });
    if (convoy) {
      convoy.undock();
      convoy.setTarget({ pos: { x, y } });
      if (!convoy.navigator.target?.pos) return;
      console.log(
        navmesh.isPointInMesh(convoy.pos),
        convoy.navigator.target.pos
      );
      const path = findPath(convoy.pos, convoy.navigator.target.pos);
      console.log('path', path);
      if (path) convoy.setPath(path);
      else convoy.setPath(null);
    }
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
          // zoom: 2 // TODO: not working with mouse click position, but browser zoom works
        }}
        onClick={() => selection.setSelected('')}
        onContextMenu={setConvoyTarget}
      >
        {world.citiesList.map((city) => {
          const onCityContextMenu: MouseEventHandler<HTMLButtonElement> = (
            e
          ) => {
            e.stopPropagation();
            e.preventDefault();
            if (convoy) convoy.setTarget(city);
          };
          return (
            <City
              id={city.id}
              key={city.id}
              onContextMenu={onCityContextMenu}
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
