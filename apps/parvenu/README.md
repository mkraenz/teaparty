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
- Copy-paste the output file `navmesh-polygons.json` to `src/assets/parvenu/`.
- Check `apps/parvenu/src/app/PathFindingTest.tsx:36~38` for the usage of the navigation mesh.
