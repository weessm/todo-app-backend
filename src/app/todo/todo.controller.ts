import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found.swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/uptade-todo.swagger';
import { TodoService } from './todo.service';

@Controller('api/v1/todo')
@ApiTags('ToDo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Returns task list successfully',
    type: IndexTodoSwagger,
    isArray: true,
  })
  async index() {
    return await this.todoService.findAllAsync();
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({
    status: 201,
    description: 'Create new task successfully',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.createAsync(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'List a task' })
  @ApiResponse({
    status: 200,
    description: 'Task data returned successfully',
    type: ShowTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFailAsync(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.updateAsync(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteByIdAsync(id);
  }
}
