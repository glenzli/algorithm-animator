import { Sort, SortComponents } from './sort'

const Algorithms = { Sort } as { [index: string]: typeof Sort }
const AlgorithmComponents = { ...SortComponents } as { [index: string]: any }

export { Algorithms, AlgorithmComponents }
