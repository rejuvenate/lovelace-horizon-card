import { HorizonCardGraph } from '../../../../src/components/horizonCard'
import { Constants } from '../../../../src/constants'
import type { IHorizonCardConfig, THorizonCardData } from '../../../../src/types'
import { TemplateResultTestHelper } from '../../../helpers/TestHelpers'

describe('HorizonCardGraph', () => {
  describe('render', () => {
    it(`renders the graph with the data values when provided`, async () => {
      const config = {
        moon: true
      } as IHorizonCardConfig

      const data = {
        partial: false,
        latitude: 40.5,
        longitude: 16.7,
        sunPosition: {
          x: 50,
          y: 50,
          horizonY: 84,
          sunriseX: 200,
          sunsetX: 400,
          scaleY: 1,
          offsetY: 0,
        },
        sunData: {

        },
        moonPosition: {
          x: 100,
          y: 25
        },
        moonData: {
          azimuth: 90,
          elevation: 45,
          fraction: 1,
          phase: Constants.MOON_PHASES.fullMoon,
          zenithAngle: 0,
          times: {

          }
        }
      } as THorizonCardData

      const horizonCardGraph = new HorizonCardGraph(config, data)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toMatchSnapshot()
    })

    it(`renders the graph with the default values when data values are not provided`, async () => {
      const config = {
        moon: true
      } as IHorizonCardConfig

      const horizonCardGraph = new HorizonCardGraph(config, Constants.DEFAULT_CARD_DATA)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toMatchSnapshot()
    })

    it(`does not render the moon when not configured so`, async () => {
      const config = {
        moon: false
      } as IHorizonCardConfig

      const horizonCardGraph = new HorizonCardGraph(config, Constants.DEFAULT_CARD_DATA)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toMatchSnapshot()
    })

    it(`does not render the sun when not configured so`, async () => {
      const config = {
        sun: false
      } as IHorizonCardConfig

      const horizonCardGraph = new HorizonCardGraph(config, Constants.DEFAULT_CARD_DATA)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toMatchSnapshot()
    })

    it(`renders golden/blue hour bands and markers supplied in the data`, async () => {
      const data = {
        ...Constants.DEFAULT_CARD_DATA,
        bands: [
          { x1: 100, x2: 140, kind: 'golden' as const },
          { x1: 60, x2: 100, kind: 'blue' as const }
        ],
        markers: [
          { x: 300, label: 'Lights on', color: '#4caf50' },
          { x: 200 }
        ]
      } as THorizonCardData

      const horizonCardGraph = new HorizonCardGraph({ sun: true } as IHorizonCardConfig, data)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toContain('horizon-card-golden-hour')
      expect(html).toContain('horizon-card-blue-hour')
      expect(html).toContain('horizon-card-marker-line')
      expect(html).toContain('Lights on')
      expect(html).toContain('#4caf50')
    })

    it(`renders no band or marker elements when the data has none`, async () => {
      const horizonCardGraph = new HorizonCardGraph({ sun: true } as IHorizonCardConfig, Constants.DEFAULT_CARD_DATA)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).not.toContain('horizon-card-sun-phases')
      expect(html).not.toContain('horizon-card-markers')
    })

    it(`crops the viewBox and the sunrise/sunset line tops to the graph frame`, async () => {
      const config = {
        sun: true
      } as IHorizonCardConfig

      const data = {
        ...Constants.DEFAULT_CARD_DATA,
        sunPosition: { ...Constants.DEFAULT_CARD_DATA.sunPosition, sunriseX: 100, sunsetX: 400 },
        graphFrame: { top: 30, height: 90 }
      } as THorizonCardData

      const horizonCardGraph = new HorizonCardGraph(config, data)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toContain('viewBox="0 30 550 90"')
      // The sunrise/sunset line tops track the frame top (30 + GRAPH_LINE_INSET_TOP 3).
      expect(html).toContain('y1="33"')
    })

    it(`falls back to the classic viewBox when the data has no frame`, async () => {
      // Simulate data from before this feature: no graphFrame present.
      const data = { ...Constants.DEFAULT_CARD_DATA, graphFrame: undefined } as unknown as THorizonCardData

      const horizonCardGraph = new HorizonCardGraph({ moon: true } as IHorizonCardConfig, data)

      const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

      expect(html).toContain('viewBox="0 0 550 150"')
    })
  })

  it(`renders the graph flipped horizontally when configured so`, async () => {
    const config = {
      southern_flip: true
    } as IHorizonCardConfig

    const horizonCardGraph = new HorizonCardGraph(config, Constants.DEFAULT_CARD_DATA)

    const html = await TemplateResultTestHelper.renderElement(horizonCardGraph)

    expect(html).toMatchSnapshot()
  })
})
