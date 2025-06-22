const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Task = require('../models/Task');

let mongoServer;
let server;

beforeAll(async () => {
  jest.setTimeout(30000);
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(4000);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
}, 30000);

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Tasks API', () => {
  it('should get all tasks', async () => {
    const task = new Task({ title: 'Test Task', description: 'Test Description' });
    await task.save();

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test Task');
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', description: 'New Description' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('New Task');

    const tasks = await Task.find();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('New Task');
  });

  it('should update a task', async () => {
    const task = new Task({ title: 'Task to Update', description: 'Initial' });
    await task.save();

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: 'Updated Task', description: 'Updated', completed: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.completed).toBe(true);

    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const task = new Task({ title: 'Task to Delete' });
    await task.save();

    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.deleted).toBe(1);

    const tasks = await Task.find();
    expect(tasks.length).toBe(0);
  });
}); 