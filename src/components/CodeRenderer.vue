<template>
  <div class="code-renderer">
    <div v-for="(code, index) in codes" :key="index" class="line">
      <span class="at" :class="{ active: pointer === index - 1 }">▸</span>
      <span :class="`indent-${code.indent}`"></span>
      <span v-for="(expr, index) in code.exprs" :key="index" :class="{ keyword: expr.keyword }">{{expr.code}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class CodeRenderer extends Vue {
  @Prop({ default: undefined }) rawCode!: string | undefined
  @Prop({ default: -1 }) pointer!: number

  get codes() {
    let codes = (this.rawCode || '').split('\n').filter(c => c.length > 0)
    return codes.map(code => {
      let indent = /^\s*/.exec(code)![0].length
      let exprs = code.split('{')
      if (exprs.length > 1) {
        let exprGroups = exprs.filter(e => e.length > 0).map(expr => {
          let group = expr.split('}')
          if (group.length > 1) {
            return [{ code: group[0], keyword: true }, { code: group[1], keyword: false }]
          } else {
            return { code: group[0], keyword: expr.includes('}') }
          }
        })
        return { exprs: Array.prototype.concat.apply([], exprGroups), indent }
      }
      return { exprs: [{ code, keyword: false }], indent }
    })
  }
}
</script>

<style lang="less" scoped>
.code-renderer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 64px;

  .at {
    color: #f7a01d;
    opacity: 0;

    &.active {
      opacity: 1;
    }
  }

  .line {
    margin: 1px 0;
    padding: 0;
    color: #eee;
  }

  .keyword {
    font-weight: bold;
    color: #82af42;
  }

  .indent(@n, @i: 1) when (@i =< @n) {
    .indent-@{i} {
      padding-left: (@i * 0.5rem);
    }
    .indent(@n, (@i + 1));
  }

  .indent(10);
}
</style>

