import { Circle, Square } from '@chakra-ui/react';
import { NavMesh, buildPolysFromGridMap } from 'navmesh';
import { FC } from 'react';

type Props = {};

const Rect: FC<{ walkable: boolean; tilesize: number; isOnPath?: boolean }> = ({
  walkable,
  tilesize,
  isOnPath,
}) => {
  return (
    <Square
      border={'white'}
      borderWidth={1}
      size={tilesize}
      borderStyle={'solid'}
      backgroundColor={isOnPath ? 'green' : walkable ? undefined : 'red'}
    />
  );
};

const PathFindingTest: FC<Props> = (props) => {
  /** 1 = walkable */
  const map = [
    [1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ];
  const tilesize = 30;
  const polys = buildPolysFromGridMap(map, tilesize, tilesize); // the tile size is how small the smallest rectangle is.
  const navMesh = new NavMesh(polys);
  const from = { x: 0, y: 0 };
  const to = { x: 4 * tilesize, y: 18 * tilesize };
  console.log(to);
  const path = navMesh.findPath(from, to);
  const downscaledPath = path?.map((p) => ({
    x: p.x / tilesize,
    y: p.y / tilesize,
  }));
  console.log(path);
  return (
    <div>
      {map.map((row, y) => {
        return (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((col, x) => {
              return (
                <Rect
                  key={x}
                  walkable={col === 1}
                  tilesize={tilesize}
                  isOnPath={downscaledPath?.some((p) => p.x === x && p.y === y)}
                />
              );
            })}
          </div>
        );
      })}
      <Circle
        position={'absolute'}
        backgroundColor={'pink'}
        top={from.y}
        left={from.x}
        size={3}
      />
      <Circle
        position={'absolute'}
        backgroundColor={'violet'}
        top={to.y}
        left={to.x}
        size={3}
      />
    </div>
  );
};

export default PathFindingTest;
