import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private task: Task;

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (search) {
      tasks = tasks.filter((t) => {
        if (t.title.includes(search) || t.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, createTaskDto: CreateTaskDto): Task[] {
    const { title, description } = createTaskDto;
    const taskInDB: Task = this.getTask(id);

    taskInDB.title = title;
    taskInDB.description = description;
    taskInDB.status = TaskStatus.IN_PROGRESS;

    return (this.tasks = this.tasks.map((t) => {
      if (t.id === taskInDB.id) {
        return taskInDB;
      }
      return t;
    }));
  }

  getTask(id: string): Task {
    const found = this.tasks.find((t) => t.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found!`);
    }
    return found;
  }

  deleteTask(id: string): void {
    const found: Task = this.getTask(id);
    this.tasks = this.tasks.filter((t) => t.id !== found.id);
  }
}
