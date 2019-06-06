<template>
  <div class="code-renderer">
    <div v-for="(code, index) in codes" :key="index" class="line">
      <span class="at" :class="{ active: pointer === index - 1 }">▸</span>
      <span :class="`indent-${code.indent}`"></span>
      <span class="expr" v-for="(token, index) in code.tokens" :key="index" :class="token.category">{{token.expr}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { PseudoCode } from '../model'

@Component
export default class CodeRenderer extends Vue {
  @Prop({ default: undefined }) rawCode!: string | undefined

  pointer = 0

  get codes() {
    return this.rawCode ? PseudoCode.Compile(this.rawCode) : []
  }

  mounted() {
    PseudoCode.pointTo = ln => { this.pointer = ln }
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

  .expr {
    padding-right: 0.25rem;
  }

  .partial {
    padding-right: 0;
  }

  .keyword {
    font-weight: bold;
    color: #82af42;
  }

  .function {
    color: #ffcd6b;
    padding-right: 0;
  }

  .object {
    padding-right: 0;
  }

  .property {
    color: #91bbff;
  }

  .operator {
    color: #df4f4f;;
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

