import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 1 }),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 1 }),
];

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
            updateAsync: jest.fn(),
            deleteByIdAsync: jest.fn(),
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
});
