import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepositry: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepositry.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepositry.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepositry.save(task);
    return task;
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.taskRepositry.save(task);

    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepositry.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }
    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepositry.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }
  }
}
