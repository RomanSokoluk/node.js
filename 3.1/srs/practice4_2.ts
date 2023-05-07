interface elemente<T> {
  [x: string]: T
}
function mapObject2<T1, T2>(element: elemente<T1>, transformer: (pole: T1) => T2): elemente<T2> {
  let result: elemente<T2> = {}
  for (let i in element) {
    result[i] = transformer(element[i])
  }
  return result;
}
let result4_2=mapObject2({ "roma": 5, vasya: 2, "das": 3, "das2": 4 }, (x) => x > 3)
console.log(result4_2)