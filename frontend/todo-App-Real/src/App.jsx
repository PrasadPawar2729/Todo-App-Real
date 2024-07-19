import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import authService from './services/authservice';
import taskService from './services/taskservice';
import Admin from './components/Admin';

const socket = io('http://localhost:2029');

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('yet to start');
  const [registerData, setRegisterData] = useState({ username: '', email: '', pass: '' });
  const [loginData, setLoginData] = useState({ username: '', pass: '' });

  useEffect(() => {
    if (user) {
      taskService.getTasks(user.token).then((res) => {
        setTasks(res.data);
      });

      socket.on('taskCreated', (task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
      });

      socket.on('taskUpdated', (updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      });

      socket.on('taskDeleted', (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      });
    }
  }, [user]);

  const handleRegister = () => {
    const { username, email, pass } = registerData;
    authService.register(username, email, pass).then(() => {
      handleLogin(username, pass);
    });
  };

  const handleLogin = () => {
    const { username, password } = loginData;
    authService.login(username, password).then((res) => {
      setUser({ username, token: res.data.token, role: res.data.role });
    });
  };

  const handleTaskCreate = () => {
    const newTask = { title: taskTitle, description: taskDescription, status: taskStatus };
    taskService.createTask(newTask, user.token).then((res) => {
      setTasks((prevTasks) => [...prevTasks, res.data]);
    });
  };

  const handleTaskUpdate = (id, updatedTask) => {
    taskService.updateTask(id, updatedTask, user.token).then((res) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? res.data : task))
      );
    });
  };

  const handleTaskDelete = (id) => {
    taskService.deleteTask(id, user.token).then(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    });
  };

  return (
    <div className="App">
      <h1>Real-Time  To-Do List</h1>
      {user ? (
        <>
          <div>
            <h2>Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task._id}>
                  {task.title} - {task.status}
                  <button onClick={() => handleTaskUpdate(task._id, { ...task, status: 'in progress' })}>In Progress</button>
                  <button onClick={() => handleTaskUpdate(task._id, { ...task, status: 'completed' })}>Complete</button>
                  <button onClick={() => handleTaskDelete(task._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Add Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
              <option value="start">Start</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={handleTaskCreate}>Add Task</button>
          </div>
          {user.role === 'admin' && <Admin token={user.token} />}
        </>
      ) : (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerData.pass}
            onChange={(e) => setRegisterData({ ...registerData, pass: e.target.value })}
          />
          <button onClick={handleRegister}>Register</button>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.pass}
            onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
