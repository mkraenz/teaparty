# Parvenu

Build, Trade, Automate. An economic simulation game.

## Getting Started

**Check the README in the repository root.**

## Major Inspirations

- Port Royale 2 and 4
- Patrician 3

## Original Attempt

- [github parvenu (old)](https://github.com/mkraenz/parvenu)

## Pathfinding & Navigation

We are relying on [Navigation Mesh](https://en.wikipedia.org/wiki/Navigation_mesh) implementation of npm lib navmesh. The required polygons to calculate pathes are precomputed (baked) and stored in `src/assets/parvenu/navmesh-polygons.json`. To avoid regenerating the navmesh instance, it's available via context and `usePathfinding` hook in `src/hooks/usePathfinding.ts`.

- From the map image, use Aseprite to generate (what I call) a navigation tilemap. That is, an image with color exactly where the units can walk. In our case, that would be the main water body while the rest of the map gets removed.
  - More precisely, open the map in Aseprite
  - use magic select (shortcut "w") with contiguous: true and tolerance (e.g. 50). This will select the water body.
  - Select the large water body/bodies you want
  - Color the selection in the targetRgba variable below (use fill tool).
  - With the selection still active, invert the selection (shortcut: crtl + shift + i) and delete the remainder of the map (shortcul: del).
  - Save to png file.
- run `image-to-number-array.ts` from [repo](https://github.com/mkraenz/remove-margins-from-tilemap/) to generate a navigation matrix.
- next, run `bake-navmesh-polygons.ts` from [repo](https://github.com/mkraenz/remove-margins-from-tilemap/) to generate the navigation mesh polygons.
- Copy-paste the output file `navmesh-polygons.json` to `apps/parvenu/src/app/navmesh-polygons.json`. (command: `cp navmesh-polygons.json /home/mirco/programming/teaparty/apps/parvenu/src/app/navmesh-polygons.json`)
- Check `apps/parvenu/src/app/PathFindingTest.tsx:36~38` for the usage of the navigation mesh.

## Releases

### To itch.io

Actualy hosted at [parvenu-test.surge.sh](https://parvenu-test.surge.sh/).

`pnpm exec nx deploy parvenu` (but only works on TypeScriptTeatime's computer because it has itch.io `butler` executable at the filepath).

Because itch.io hosts the page on a random sub-path, things get complicated wrt to script file inclusion (and if that would work, probably more trouble with navigation). In either case, for that reason, I just use itchio to host a skeleton html with an iframe. The iframe points to the actual game hosted on surge.sh. On surge, it's just as you would expect a webapp to work.
