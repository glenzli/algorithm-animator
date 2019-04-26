import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export class NumericArrayAlgorithmMixin extends Vue {
  @Prop({ default: () => [] }) data!: Array<number>
  @Prop({ default: 500 }) delay!: number
}
