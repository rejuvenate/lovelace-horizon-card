export {}

declare global {
  interface Window {
    customCards: {
      name: string,
      type: string,
      description: string,
      preview?: boolean,
      documentationURL?: string
    }[]
  }

  interface Intl {
    DateTimeFormatOptions: {
      timeStyle: string
    }
  }

  namespace Intl {
    interface DateTimeFormatOptions {
      timeStyle: string
    }
  }
}

