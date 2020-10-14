import { HousesParser } from './HousesParser'

test('Parser created & isHouseIncluded returns boolean', ()=> {
  const input = ' четные 2-28, нечетные 1-21 '
  const parser = new HousesParser(input)
  expect(parser).toBeDefined()
  expect(typeof parser.isHouseIncluded('2') === 'boolean').toBe(true) 
})
test(' четные 2-28, нечетные 1-21 ', ()=> {
  const input = ' четные 2-28, нечетные 1-21 '
  const parser = new HousesParser(input)
  expect(parser.isHouseIncluded('100')).toBe(false)
  expect(parser.isHouseIncluded('101')).toBe(false)
  expect(parser.isHouseIncluded('29')).toBe(false)
  expect(parser.isHouseIncluded('30')).toBe(false)
  
  expect(parser.isHouseIncluded('1')).toBe(true)
  expect(parser.isHouseIncluded('2')).toBe(true)
  expect(parser.isHouseIncluded('4')).toBe(true)
  expect(parser.isHouseIncluded('28')).toBe(true)
})

test(' нечетные 11+, четные 42+', ()=> {
  const input = ' нечетные 11+, четные 42+'
  const parser = new HousesParser(input)
  expect(parser.isHouseIncluded('1')).toBe(false)
  expect(parser.isHouseIncluded('12')).toBe(false)
  expect(parser.isHouseIncluded('40')).toBe(false)

  expect(parser.isHouseIncluded('11')).toBe(true)
  expect(parser.isHouseIncluded('13')).toBe(true)
  expect(parser.isHouseIncluded('42')).toBe(true)
  expect(parser.isHouseIncluded('43')).toBe(true)
})

test(' четные с 20 и вся улица до конца', ()=> {
  const input = '• четные с 20 и вся улица до конца'
  const parser = new HousesParser(input)
  expect(parser.isHouseIncluded('1')).toBe(false)
  expect(parser.isHouseIncluded('12')).toBe(false)
  expect(parser.isHouseIncluded('13')).toBe(false)
  expect(parser.isHouseIncluded('21')).toBe(false)


  expect(parser.isHouseIncluded('20')).toBe(true)
  expect(parser.isHouseIncluded('222')).toBe(true)
})

test(' 7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а', ()=> {
  const input = ' 7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а'
  const parser = new HousesParser(input)
  expect(parser.isHouseIncluded('7/1')).toBe(true)
  expect(parser.isHouseIncluded(' 7/1 ')).toBe(true)
  expect(parser.isHouseIncluded('11')).toBe(true)
  expect(parser.isHouseIncluded('15а')).toBe(true)
  expect(parser.isHouseIncluded('17')).toBe(true)

  expect(parser.isHouseIncluded('6')).toBe(false)
  expect(parser.isHouseIncluded('100')).toBe(false)
  expect(parser.isHouseIncluded('15a')).toBe(false) //!!! English literal
})

test('12, 22, 36, 42, 45, 100-106', ()=> {
  
  const input = '12, 22, 36, 42, 45, 100-106'
  const parser = new HousesParser(input)

  expect(parser.isHouseIncluded(' 50')).toBe(false)
  expect(parser.isHouseIncluded('1')).toBe(false)
  expect(parser.isHouseIncluded('107')).toBe(false)
  expect(parser.isHouseIncluded('99')).toBe(false)
  expect(parser.isHouseIncluded('1')).toBe(false)

  expect(parser.isHouseIncluded('100')).toBe(true)
  expect(parser.isHouseIncluded('12')).toBe(true)
  expect(parser.isHouseIncluded('22')).toBe(true)
  expect(parser.isHouseIncluded('36')).toBe(true)
  expect(parser.isHouseIncluded('42')).toBe(true)
  expect(parser.isHouseIncluded('45')).toBe(true)
  expect(parser.isHouseIncluded(' 101 ')).toBe(true)
  expect(parser.isHouseIncluded('100')).toBe(true)
  expect(parser.isHouseIncluded('106')).toBe(true)
})

test('четные 2-28, нечетные 1-21', ()=> {
  const inputArr = [
   '• четные 2-28, нечетные 1-21',
  '• четные 2-28; нечетные 1-21',
  '• четные 2-28 нечетные 1-21',
  '• четные2-28нечетные1-21',
  ]
  inputArr.map(inp => {
    const parser = new HousesParser(inp)
    expect(parser.isHouseIncluded('29')).toBe(false)
    expect(parser.isHouseIncluded('30')).toBe(false)
    expect(parser.isHouseIncluded('23')).toBe(false)

    expect(parser.isHouseIncluded('1')).toBe(true)
    expect(parser.isHouseIncluded('2')).toBe(true)
    expect(parser.isHouseIncluded('28')).toBe(true)
    expect(parser.isHouseIncluded('22')).toBe(true)
  })

})