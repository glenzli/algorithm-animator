import { Array$ } from 'js-corelib'
import { Interact, InteractAbortError } from './Interact'

enum CodeCategory {
  None = '',
  Partial = 'partial',
  Keyword = 'keyword',
  Function = 'function',
  Object = 'object',
  Property = 'property',
  Operator = 'operator',
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
  private _keywords = new Set(['if', 'else', 'for', 'while', 'break', 'continue', 'switch', 'case', 'true', 'false', 'nil', 'return'])
  private _translations = new Map<string, string>()
  private _pointTo: (ln: number) => void = () => { }
  private _enabled = true

  get pointTo() {
    return this._pointTo
  }

  set pointTo(value: (ln: number) => void) {
    this._pointTo = value
  }

  get enabled() {
    return this._enabled
  }

  set enabled(value: boolean) {
    this._enabled = value
  }

  Pseudo(key: string, code: string) {
    this._translations.set(key, code)
  }

  GetCode(key: string, category = '') {
    if (category) {
      key = `${category}.${key}`
    }
    return this._translations.get(key)
  }

  async RunAt(ln: number) {
    if (this._enabled) {
      this._pointTo(ln)
    }
    await Interact.Doze().catch(() => {})
  }

  async RunThrough(...lns: Array<number>) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lns.length; ++i) {
      await Interact.HighspeedExecute(() => this.RunAt(lns[i]))
    }
  }

  private Format(codeLine: string) {
    const SYMBOL_SPACING = /\s?([^a-zA-Z0-9.\s])\s?/g
    return codeLine.replace(SYMBOL_SPACING, ' $1 ')
  }

  private IsVariable(expr: string) {
    const VAR = /[a-zA-Z0-9]+/g
    return VAR.test(expr)
  }

  private IsOperator(expr: string) {
    const OP = /[^a-zA-Z0-9\[\]().,:]+/g
    return OP.test(expr)
  }

  Compile(code: string) {
    let codeLines = code.split('\n').filter(codeLine => codeLine.length > 0)
    return Array$.NonNull(codeLines.map(codeLine => {
      let indent = /^\s*/.exec(codeLine)![0].length / 2
      let exprs = this.Format(codeLine.trim()).split(' ').filter(expr => !!expr)
      if (exprs.length > 0) {
        let tokens = Array$.Flat<CodeToken>(exprs.map((t, i) => {
          if (this._keywords.has(t)) {
            return { category: CodeCategory.Keyword, expr: t } as CodeToken
          } else if (exprs[i + 1] === '(' && this.IsVariable(t)) {
            return { category: CodeCategory.Function, expr: t } as CodeToken
          } else if (exprs[i + 1] === '[' && this.IsVariable(t)) {
            return { category: CodeCategory.Object, expr: t } as CodeToken
          } else if (t.includes('.')) {
            let ts = t.split('.')
            return [{ category: CodeCategory.Partial, expr: `${ts[0]}.` }, { category: CodeCategory.Property, expr: ts[1] }] as Array<CodeToken>
          } else {
            return { category: this.IsOperator(t) ? CodeCategory.Operator : CodeCategory.None, expr: t } as CodeToken
          }
        }))
        return { tokens, indent } as CodeLine
      }
      return null
    }))
  }

  Normalize(code: string) {
    let codeLines = code.split('\n')
    let extraIndent = /^\s*/.exec(codeLines[0])![0].length
    return codeLines.map(codeLine => codeLine.substr(extraIndent)).join('\n')
  }

  async SilentExecute<T>(f: () => Promise<T>) {
    let currentState = this._enabled
    this.enabled = false
    let result = await f()
    this.enabled = currentState
    return result
  }
}

export const PseudoCode = new PseudoCodeTranslator()
