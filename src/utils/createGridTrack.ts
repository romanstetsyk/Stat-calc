export function createGridTrack<GridTrack>(): GridTrack;
export function createGridTrack<GridTracks>(): GridTracks;

export function createGridTrack() {
  return Object.defineProperty({}, "length", { value: 0, writable: true });
}
