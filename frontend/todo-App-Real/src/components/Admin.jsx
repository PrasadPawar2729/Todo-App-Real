import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import taskService from '../services/taskservice';

const Admin= ({ token }) => {
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await taskService.getTasks(token);
      const tasks = response.data;

      const statusCounts = tasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { 'yet to start': 0, 'in progress': 0, completed: 0 }
      );

      setTaskData({
        labels: ['Yet to Start', 'In Progress', 'Completed'],
        datasets: [
          {
            label: 'Tasks',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [
              statusCounts['yet to start'],
              statusCounts['in progress'],
              statusCounts['completed'],
            ],
          },
        ],
      });
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Bar
        data={taskData}
        options={{
          title: {
            display: true,
            text: 'Task Status Distribution',
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
    </div>
  );
};

export default Admin;
