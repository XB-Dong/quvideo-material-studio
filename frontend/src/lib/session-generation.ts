// A browser session generation scopes request side effects, including errors.
let generation = 0;
export function currentSessionGeneration() {
  return generation;
}
export function advanceSessionGeneration() {
  return ++generation;
}
