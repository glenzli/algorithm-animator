export const VALUE_GENERATORS = [
  () => Math.floor(100 * Math.random()),
] as Array<() => any>

export const QUANTIZERS = [
  (val: number) => Number.isNaN(val) ? 0 : Math.min(val / 99, 1),
] as Array<(val: any) => number>
