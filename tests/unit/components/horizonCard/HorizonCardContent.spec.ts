import { html } from 'lit'

import { HorizonCardContent } from '../../../../src/components/horizonCard'
import { IHorizonCardConfig, THorizonCardData } from '../../../../src/types'
import { HelperFunctions } from '../../../../src/utils/HelperFunctions'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/components/horizonCard/HorizonCardHeader', () => require('../../../mocks/HorizonCardHeader'))
jest.mock('../../../../src/components/horizonCard/HorizonCardGraph', () => require('../../../mocks/HorizonCardGraph'))
jest.mock('../../../../src/components/horizonCard/HorizonCardFooter', () => require('../../../mocks/HorizonCardFooter'))

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('HorizonCardContent', () => {
  describe('render', () => {
    beforeAll(() => {
      jest.spyOn(HelperFunctions, 'nothing').mockImplementation(() => html``)
    })

    it('sets dark mode when it is set to true on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        darkMode: true
      }

      const horizonCardContent = new HorizonCardContent(config, {} as THorizonCardData)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not set dark mode when it is set to false on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        darkMode: false
      }

      const horizonCardContent = new HorizonCardContent(config, {} as THorizonCardData)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('renders the header when show header returns true', async () => {
      const horizonCardContent = new HorizonCardContent({} as IHorizonCardConfig, {} as THorizonCardData)
      jest.spyOn((horizonCardContent as unknown as { showHeader: () => boolean }), 'showHeader').mockImplementation(() => true)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the header when show header returns false', async () => {
      const horizonCardContent = new HorizonCardContent({} as IHorizonCardConfig, {} as THorizonCardData)
      jest.spyOn((horizonCardContent as unknown as { showHeader: () => boolean }), 'showHeader').mockImplementation(() => false)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('renders the footer when show footer returns true', async () => {
      const horizonCardContent = new HorizonCardContent({} as IHorizonCardConfig, {} as THorizonCardData)
      jest.spyOn((horizonCardContent as unknown as { showFooter: () => boolean }), 'showFooter').mockImplementation(() => true)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('does not render the footer when show footer returns false', async () => {
      const horizonCardContent = new HorizonCardContent({} as IHorizonCardConfig, {} as THorizonCardData)
      jest.spyOn((horizonCardContent as unknown as { showFooter: () => boolean }), 'showFooter').mockImplementation(() => false)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardContent.render>
      element.templateResultFunction = () => horizonCardContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })
})
