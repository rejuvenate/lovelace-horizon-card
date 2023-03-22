import { HorizonCardGraph } from '../../../../src/components/horizonCard'
import { THorizonCardData } from '../../../../src/types'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../../helpers/TestHelpers'

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('HorizonCardGraph', () => {
  describe('render', () => {
    it(`should the graph with the data values when provided`, async () => {
      const data = {
        sunInfo: {
          dawnProgressPercent: 100,
          dayProgressPercent: 100,
          duskProgressPercent: 23,
          sunAboveHorizon: false,
          sunPercentOverHorizon: 0,
          sunPosition: {
            x: 50,
            y: 50
          },
          sunrise: 200,
          sunset: 400
        }
      } as THorizonCardData

      const horizonCardGraph = new HorizonCardGraph(data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardGraph.render>
      element.templateResultFunction = () => horizonCardGraph.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it(`should the graph with the default values when data values are not provided`, async () => {
      const data = {} as THorizonCardData
      const horizonCardGraph = new HorizonCardGraph(data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardGraph.render>
      element.templateResultFunction = () => horizonCardGraph.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })
})
