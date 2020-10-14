import IRange from './IRange'

export class HousesParser {
  private infiniteOddRangeStart: number | null
  private infiniteEvenRangeStart: number | null
  private finiteOddRange: IRange[] | null
  private finiteEvenRange: IRange[] | null
  private listOfValue: string[] | null
  private solidRange: IRange[]


  constructor(private readonly source: string) {
    this.infiniteOddRangeStart = this.getInfiniteRangeStartPoint(source, 'odd')
    this.infiniteEvenRangeStart = this.getInfiniteRangeStartPoint(source, 'even')
    this.finiteOddRange = this.getFiniteRange(source, 'odd')
    this.finiteEvenRange = this.getFiniteRange(source, 'even')
    this.listOfValue = this.getListOfValue(source)
    this.solidRange = this.getSolidRange(source)
  }

  public isHouseIncluded(house: string) {

    const hnumber = parseInt(house.trim()) 
    let result = false 

    if (this.finiteOddRange) {
      result = result || this.checkFiniteRange(hnumber, 'odd')
    }
    if (this.finiteEvenRange) {
      result = result || this.checkFiniteRange(hnumber, 'even')
    }

    if (this.infiniteOddRangeStart) {
      result = result || this.checkInfiniteRange(hnumber, 'odd')
    }

    if (this.infiniteEvenRangeStart) {
      result = result || this.checkInfiniteRange(hnumber, 'even')
    }

    if (this.solidRange) {
      result = result || this.checkSolidRanges(hnumber)
    }

    if (this.listOfValue) {
      result = result || this.isInList(house)
    }
    return result
  }

  private isInList(data: string) {
    return this.listOfValue.includes(data.trim())
  }

  private checkSolidRanges(house: number) {

    const inRange = this.solidRange      
        .reduce((acc: boolean, el: IRange) => {
          const res = house>=el.min && house<=el.max
          return acc || res
      }, false)
    return inRange
  }

  private checkInfiniteRange(house: number, type) {
    const parity = (type==='odd') ? (house % 2 !== 0) : (house % 2 === 0)
    const startRange = (type==='odd') ? this.infiniteOddRangeStart : this.infiniteEvenRangeStart
    const inRange = house >=startRange
    return parity && inRange
  }

  private checkFiniteRange(house: number, type) {
    const parity = (type==='odd') ? (house % 2 !== 0) : (house % 2 === 0)
    const range =   (type==='odd') ? this.finiteOddRange : this.finiteEvenRange
    const inRange = range      
        .reduce((acc: boolean, el: IRange) => {
          const res = house>=el.min && house<=el.max
          return acc || res
      }, false)
    return parity && inRange
  }

  private getFiniteRange(data: string, tp) {
    const rg = (tp === 'even')
      ? /(^|\s+)четные(\s?|\s+)(\d+)-(\d+)/g
      : /(^|\s+|\d)нечетные(\s?|\s+)(\d+)-(\d+)/g

    const resArr = data.match(rg) || []
    const out = resArr.reduce((ac: IRange[], el: string) => {
      const arr = el.match(/\d+/g) || []
      if (arr.length < 2) return ac
      const min = parseInt(arr[arr.length - 2])
      const max = parseInt(arr[arr.length - 1])
      ac.push({ min, max })
      return ac
    }, [] as IRange[])
    if (out.length === 0) return null
    return out
  }

  private getInfiniteRangeStartPoint(data: string, tp) {
    const evnRg = /(^|\s+|\d)четные\s+(с\s+\d+\s+и\s+вся\s+улица\s+до\s+конца|\d+\+)/g
    const oddRg = /(^|\s+|\d)нечетные\s+(с\s+\d+\s+и\s+вся\s+улица\s+до\s+конца|\d+\+)/g
    const rg = (tp === 'even') ? evnRg : oddRg
    const resArrWithText = data.match(rg) || []
    const res = resArrWithText.map(el => parseInt(el.match(/\d+/g)[0]))
    if (res.length === 0) return null
    return Math.min(...res)
  }

  private getListOfValue(data: string): string[] {
    const rg1 = /(\s|^)\d+((\/\d)*|а?)(,|$)/g
    const rg2 = /\s\d+[а-яА-Я]/g

    const arr1 = (data.match(rg1) || []).map((el: string) => {
      return (el.replace(',', '')).trim()
    })
    const arr2 = data.match(rg2) || []
    const result = [...arr1, ...arr2]
    if (result.length === 0) return null
    return result
  }

  private getSolidRange(data: string): IRange[] {
    const rg1 = /((?<=(, \s*))\d+-\d+)/g
    const rg2 = /^\d+-\d+/g
    const rg3 = /(?<=(\n))\d+-\d+/g
    const res1 = data.match(rg1) || []
    const res2 = data.match(rg2) || []
    const res3 = data.match(rg3) || []
    const allResults = [...res1, ...res2, ...res3]
    const out: [] = allResults.reduce((ac: any, el) => {
      const rangeArr = el.split('-')
      const min = parseInt(rangeArr[0])
      const max = parseInt(rangeArr[1])
      if (min > max) return ac
      const data = { min, max } as IRange
      ac.push(data)
      return ac
    }, []) || []
    if (out.length === 0) return null
    return out
  }
}
