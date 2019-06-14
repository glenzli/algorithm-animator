import { Sort, SortComponents } from './sort'
import { DataType, DataTypeComponents } from './dt'

const Algorithms = { Sort, DataType } as { [index: string]: (typeof Sort | typeof DataType) }
const AlgorithmComponents = { ...SortComponents, ...DataTypeComponents } as { [index: string]: any }

export { Algorithms, AlgorithmComponents }
