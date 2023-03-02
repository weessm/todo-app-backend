import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAllAsync() {
    return await this.todoRepository.find();
  }

  async findOneOrFailAsync(id: string) {
    try {
      return await this.todoRepository.findOneByOrFail({ id: id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createAsync(data: CreateTodoDto) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async updateAsync(id: string, data: UpdateTodoDto) {
    const todo = await this.findOneOrFailAsync(id);
    this.todoRepository.merge(todo, data);
    return await this.todoRepository.save(todo);
  }

  async deleteByIdAsync(id: string) {
    await this.findOneOrFailAsync(id);
    await this.todoRepository.softDelete(id);
  }
}
