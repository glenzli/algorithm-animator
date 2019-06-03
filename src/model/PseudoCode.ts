import { Interact } from './Interact'

enum CodeCategory {
  None = '',
  Keyword = 'keyword',
  Function = 'function',
}

interface CodeToken {
  category: CodeCategory,
  expr: string,
}

interface CodeLine {
  tokens: Array<CodeToken>,
  indent: number,
}

class PseudoCodeTranslator {
  private _keywords = new Set(['if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'true', 'false', 'nil'])
  private _translations = new Map<string, string>()
  private _pointTo: (ln: number) => void = () => { }

  get pointTo() {
    return this._pointTo
  }

  set pointTo(value: (ln: number) => void) {
    this._pointTo = value
  }

  Pseudo(key: string, code: string) {
    this._translations.set(key, code)
  }

  GetCode(key: string) {
    return this._translations.get(key)
  }

  async RunAt(ln: number) {
    this._pointTo(ln)
    try {
      await Interact.Doze()
    } catch (e) {}
  }

  Compile(code: string) {
    let codeLines = code.split('\n').filter(codeLine => codeLine.length > 0)
    return codeLines.map(codeLine => {
      let indent = /^\s*/.exec(codeLine)![0].length
      let tokens = Array.prototype.concat.apply([], codeLine.trim().split(' ').map(t => {
        if (this._keywords.has(t)) {
          return { category: CodeCategory.Keyword, expr: t } as CodeToken
        } else if (t.includes('(')) {
          let ts = t.split('(')
          return [{ category: CodeCategory.Function, expr: ts[0] }, { category: CodeCategory.None, expr: `(${ts[1]}` }] as Array<CodeToken>
        } else {
          return { category: CodeCategory.None, expr: t } as CodeToken
        }
      })) as Array<CodeToken>
      return { tokens, indent } as CodeLine
    })
  }
}

export const PseudoCode = new PseudoCodeTranslator()
