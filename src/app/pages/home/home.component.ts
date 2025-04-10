import { Component, computed, effect, signal, inject, Injector } from '@angular/core';
import { Task } from '../../models/Task.model';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterStatus } from '../../enums/FilterStatus.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  FilterStatus = FilterStatus
  tasks = signal<Task[]>([])
  injector = inject(Injector)

  taskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3)
    ]
  })

  filterStatus = signal<FilterStatus>(FilterStatus.all)
  filteredTasks = computed(() => {
    switch (this.filterStatus()) {
      case FilterStatus.completed:
        return this.tasks().filter(task => task.completed)
      case FilterStatus.pending:
        return this.tasks().filter(task => !task.completed)
      default:
        return this.tasks()
    }
  })


  ngOnInit(){
    const lsTasks = localStorage.getItem('tasks')
    if (lsTasks) {
      this.tasks.set(JSON.parse(lsTasks))
    }
    this.trackTasks()
  }

  trackTasks(){
    effect(() => {
      const tasks = this.tasks()
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }, {injector: this.injector})
  }

  onEnterHandler() {
    if(this.taskControl.valid){
      const value = this.taskControl.value
      this.addNewTask(value)
      this.taskControl.setValue('')
    }
  }

  addNewTask = (value: string) => {
    this.tasks.update(tasks => {
      let newTask = {
        id: Date.now(),
        title: value.trim(),
        completed: false
      }
      return [...tasks, newTask]
    })
  }
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((e,i) => i != index))
  }
  onChangeCheckBoxHandler(event: Event, index: number, cb: (index: number, value: boolean) => void){
    const value = (event.target as HTMLInputElement).checked
    cb(index, value)
  }
  updateCompleted = (index: number, value: boolean) => {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position != index) {
          return task
        } else {
          return {
            ...task,
            completed: value
          }
        }
      })
    })
  }
  updateTask(indexToUpdate: number, updatedTask: Task){
    this.tasks.update(tasks => {
      return tasks.map((task, index) => index == indexToUpdate ? updatedTask : task)
    })
  }
  enterEditMode(index: number) {
    const updatedTask = this.tasks()[index]
    if (updatedTask.completed)
      return;
    this.updateTask(index, {...updatedTask, edit: true})
    this.tasks().forEach((element,i) => {
      if (i != index) {
        this.updateTask(i, {...element, edit: false})
      }
    });
  }
  saveEdition(index: number, event: Event, oldName: String) {
    const input = event.target as HTMLInputElement
    const title = input.value.trim() == '' ? oldName : input.value
    const task = this.tasks()[index]
    this.updateTask(index, {...task, edit: false, title})
  }
  filter(status: FilterStatus){
    this.filterStatus.set(status)
  }
  removeCompleted(){
    this.tasks.update(tasks => {
      return tasks.filter(task => !task.completed)
    })
  }
}
