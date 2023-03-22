import { HorizonCardHeader } from '../../../../src/components/horizonCard'
import { IHorizonCardConfig, THorizonCardData, THorizonCardTimes } from '../../../../src/types'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/utils/HelperFunctions', () => require('../../../mocks/HelperFunctions'))

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('HorizonCardHeader', () => {
  describe('render', () => {
    it('renders the title if it is present in the configuration', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        title: 'test'
      }

      const data = {

      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the title if it is not present in the configuration', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card'
      }

      const data = {

      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('renders the sunrise field when it is present in the data and it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: true
        }
      }

      const data = {
        times: {
          sunrise: new Date(0)
        } as THorizonCardTimes
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is present in the data but it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: false
        }
      }

      const data = {
        times: {
          sunrise: new Date(0)
        } as THorizonCardTimes
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is not present in the data but it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: true
        }
      }

      const data = {} as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is not present in the data and it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: false
        }
      }

      const data = {} as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('renders the sunset field when it is present in the data and it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: true
        }
      }

      const data = {
        times: {
          sunset: new Date(0)
        } as THorizonCardTimes
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunset field when it is present in the data but it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: false
        }
      }

      const data = {
        times: {
          sunset: new Date(0)
        } as THorizonCardTimes
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunset field when it is not present in the data but it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: true
        }
      }

      const data = {} as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the sunset field when it is not present in the data and it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: false
        }
      }

      const data = {} as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardHeader.render>
      element.templateResultFunction = () => horizonCardHeader.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })
})
