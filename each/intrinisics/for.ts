import { effect, type EffectScope, effectScope } from '@vue/reactivity'
import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
  patch,
  runInContext,
} from '../renderer'

export interface ForAttributes {
  $in: string
  key: string
}

const component = defineComponent(
  ({ $in, key }: ForAttributes, children) => {
    const context = getCurrentContext()
    const iterable = createAdhoc<Iterable<any>>($in)
    const container = document.createElement('span')
    let scope: EffectScope

    effect(() => {
      scope?.stop()
      scope = effectScope()
      const root = document.createElement('span')
      for (const item of iterable(context)) {
        scope.run(
          () => root.append(
            ...runInContext({ [key]: item }, children, context),
          ),
        )
      }

      patch(container, root)
    })

    return container
  },
)

intrinsics.set('for', component)

export default component
