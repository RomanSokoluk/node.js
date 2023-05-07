function mapObject<T1 extends Record<string, T1[keyof T1]>, T2>(element: T1, 
  transformer: (pole:T1[keyof T1]) => T2): Partial<Record<keyof T1, T2>> {
  let result: Partial<Record<keyof T1, T2>> = {}
  for (let i in element) {
    result[i] = transformer(element[i])
  }
  return result;
}
let result4=mapObject({ "roma": 5, vasya: NaN, "das": 3, "das2": 4 }, (x) => x > 3)
console.log(result4)