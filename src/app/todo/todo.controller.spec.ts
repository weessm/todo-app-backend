import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 1 }),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 1 }),
];

const updatedTodoEntity = new TodoEntity({ task: 'task-1', isDone: 0 });

const newTodoEntity = new TodoEntity({ task: 'new-task', isDone: 0 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAllAsync: jest.fn().mockResolvedValue(todoEntityList),
            createAsync: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFailAsync: jest.fn().mockResolvedValue(todoEntityList[0]),
            updateAsync: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteByIdAsync: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      const result = await todoController.index();

      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAllAsync).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoService, 'findAllAsync')
        .mockRejectedValueOnce(new Error());

      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      const result = await todoController.create(body);

      expect(result).toEqual(newTodoEntity);
      expect(todoService.createAsync).toHaveBeenCalledTimes(1);
      expect(todoService.createAsync).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'createAsync').mockRejectedValueOnce(new Error());

      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get a todo item successfully', async () => {
      const result = await todoController.show('1');

      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.findOneOrFailAsync).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFailAsync).toHaveBeenCalledWith('1');
      expect(typeof result).toEqual('object');
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoService, 'findOneOrFailAsync')
        .mockRejectedValueOnce(new Error());

      expect(todoController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 0,
      };

      const result = await todoController.update('1', body);

      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.updateAsync).toHaveBeenCalledTimes(1);
      expect(todoService.updateAsync).toHaveBeenCalledWith('1', body);
      expect(typeof result).toEqual('object');
    });

    it('should throw an exception', () => {
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 0,
      };

      jest.spyOn(todoService, 'updateAsync').mockRejectedValueOnce(new Error());

      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should remove a todo item successfully', async () => {
      const result = await todoController.destroy('1');

      expect(result).toBeUndefined();
      expect(todoService.deleteByIdAsync).toHaveBeenCalledTimes(1);
      expect(todoService.deleteByIdAsync).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoService, 'deleteByIdAsync')
        .mockRejectedValueOnce(new Error());

      expect(todoController.destroy('1')).rejects.toThrowError();
    });
  });
});
