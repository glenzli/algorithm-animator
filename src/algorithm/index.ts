import { Sort, SortComponents } from './sort'
import { DataStructure, DataStructureComponents } from './dt'

const Algorithms = { Sort, 'Data Structure': DataStructure } as { [index: string]: (typeof Sort | typeof DataStructure) }
const AlgorithmComponents = { ...SortComponents, ...DataStructureComponents } as { [index: string]: any }

export { Algorithms, AlgorithmComponents }
