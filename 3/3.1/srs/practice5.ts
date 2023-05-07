// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т, но возможно не со всеми полями
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1, 
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :) 
// нас интересует только ее сигнатура.

import { type } from "os";

// 1)
function func1_1<T>(input: Partial<T>) {
}
func1_1<{ n1: string, n2: string }>({ n1: "string" })
// 2)
function func1_2<T1, T2>(input1: T1, input2: T2): T1 | T2 {
  type res = T1 | T2;
  let re: T1 | T2;
  re = "No" as res;
  return re;
}

// Более сложный вариант:
// Напишите функцию, которая принимает:
// 1) некие данные предполагаемо типа Т (у которого поле id: string), 
//    но возможно без поля id
// 2) функцию-дополнятор, которая принимает такие штуки как из п.1, 
//    а возвращает полноценный объект типа Т
// ... как вы поняли, саму функцию писать не надо :) 
// нас интересует только ее сигнатура.

// 1)
function func2_1<T>(input: T | Omit<T, "id">) {
}
func2_1<{ n1: string, id: string }>({ n1: "string", id: "string" })
func2_1<{ n1: string, id: string }>({ n1: "string" })


// Последняя задача:
// Напишите сигнатуру функции, которая принимает
// - некий класс 
// - количество
// ...а возвращает массив экземпляров этого класса
function func3_1<T>(input: T, quantity: number): Array<T> {
  return new Array<T>(quantity)
}
func3_1({ i: 3 }, 5)

class Rectangle {
  w!: number;
  h!: number;
}
class Circle {
  radius!: number;
}
// сделайте норм сигнатуру тут.
// НЕТ, Rectangle|Circle это не вариант, надо сделать универсальную функцию 
function наштамповать<T extends new (...args: any) => any>(
  SOMECLASS: T, count: number): InstanceType<T>[] {
  let a = []
  for (let i = 0; i < count; i++)
    a.push(new SOMECLASS());

  return a;
}
let a: Rectangle[] = наштамповать(Rectangle, 10);
let b: Circle[] = наштамповать(Circle, 20)