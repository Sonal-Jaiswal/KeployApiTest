const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const Task = require('../models/Task');

jest.mock('../models/Task');

const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Task Controller - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all tasks', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const tasks = [{ title: 'Test', description: 'Test desc' }];
    Task.find.mockResolvedValue(tasks);

    await getTasks(req, res);

    expect(Task.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  it('should create a task', async () => {
    const req = mockRequest({ title: 'New Task', description: 'New Desc' });
    const res = mockResponse();
    const task = { title: 'New Task', description: 'New Desc', save: jest.fn() };
    Task.prototype.save = task.save;
    Task.mockImplementation(() => task);

    await createTask(req, res);

    expect(Task).toHaveBeenCalledWith({ title: 'New Task', description: 'New Desc' });
    expect(task.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(task);
  });

  it('should update a task', async () => {
    const req = mockRequest({ title: 'Updated', completed: true }, { id: '1' });
    const res = mockResponse();
    const updatedTask = { title: 'Updated', completed: true };
    Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

    await updateTask(req, res);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'Updated', completed: true, description: undefined }, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedTask);
  });

  it('should delete a task', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    Task.findByIdAndDelete.mockResolvedValue({});

    await deleteTask(req, res);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
  });
}); 