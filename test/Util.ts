export namespace TestUtil$ {
  export namespace Operator {
    export function Insert<T>(source: Array<T>, delta: Array<T>) {
      return source.concat(delta)
    }

    export function Delete<T>(source: Array<T>, delta: Array<T>) {
      let output = source.slice()
      delta.forEach(deleted => {
        let index = output.indexOf(deleted)
        if (index > -1) {
          output.splice(index, 1)
        }
      })
      return output
    }

    export function Replace<T>(source: Array<T>, delta: Array<T>) {
      let deleted = delta.slice(0, delta.length / 2)
      let inserted = delta.slice(delta.length / 2)
      let output = source.slice()
      deleted.forEach((origin, i) => {
        let index = output.indexOf(origin)
        if (index > -1) {
          output.splice(index, 1, inserted[i])
        }
      })
      return output
    }
  }
}
