import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { Person } from '../../models/Person';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  textControl = new FormControl('',{
    validators: [
      Validators.required,
      Validators.minLength(5)
    ]
  })
  widthControl = new FormControl(50)
  heightControl = new FormControl(50)
  backgroundColorControl = new FormControl("#000000")

  colorController = new FormControl()
  backgroundColor = "#000000"
  signalName = signal('Amilcar')
  name = 'Amilcar Sanchez'
  age = '41'
  occupation = 'Software Engineer'
  company = 'Dexcom'
  person = signal({
    name: 'amilcar',
    age: 41
  })
  p = new Person('Amilcar',
    41,
    './assets/images/img.png')
  newItem = ''
  public tasks = signal([
    'Instalar Angular CLI',
    'Crear Proyecto',
    'Crear Componente',
    'Crear Servicio'
  ])
  constructor(){
    this.colorController.valueChanges.subscribe((value) => {
      console.log(value)
    })
  }
  addNew(){
    let updateTasks = this.tasks()
    updateTasks.push(this.newItem)
    this.tasks.set(updateTasks)
    this.newItem = ''
  }
  clickHandler(){
    alert('Hello world')
  }
  changeHandler(event: Event){
    console.log(event)
  }
  keyDownHandler() {
    console.log('Ctrl + S was pressed')
  }
  signalNameKeyUpHandler(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value
    this.signalName.set(value)
  }
  onChangePersonAge(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.person.update((currentState) => {
      return {
        ...currentState,
        age: parseInt(value, 10)
      }
    })
  }
}
