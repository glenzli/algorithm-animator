import { Component, Vue } from 'vue-property-decorator'
import { Algorithm, AbstractData, ADT, Interact } from '../model'

@Component
export class AlgorithmMixin extends Vue {
  abstractData: AbstractData = { id: -1 }

  Init() {}

  async Run() {
    let algorithm = Algorithm.From<Algorithm<AbstractData, ADT<AbstractData>>>(this.abstractData.id)
    this.abstractData = algorithm.Init()
    await algorithm.Run()
  }

  mounted() {
    this.Init()
    this.Run()
  }
}
