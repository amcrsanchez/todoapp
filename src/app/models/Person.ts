export class Person {
  constructor(public name: string, public age: number, public image: string){}
  stringify() :string {
    return `Hi my name is ${this.name} and i am ${this.age} years old`
  }
}
