export class I18N {
  public formatDateAsTime (date: Date): string {
    return `${date.getTime()}`
  }

  public formatDecimal (num: number): string {
    return num.toString()
  }

  public tr (translationKey: string): string {
    return translationKey
  }

  public localize (key: string): string {
    return key
  }
}
