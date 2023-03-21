import * as fs from 'fs'

import { Constants } from '../../src/constants'

describe('constants', () => {
  describe('LOCALIZATION_LANGUAGES', () => {
    it('all languages files are added', () => {
      expect.hasAssertions()
      const fileNames = fs.readdirSync('src/assets/localization/languages')
      for (const fileName of fileNames) {
        const [language] = fileName.split('.')
        expect(Object.keys(Constants.LOCALIZATION_LANGUAGES)).toContain(language)
      }
    })
  })
})
