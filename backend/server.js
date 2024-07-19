const express = require('express');
const app = express()
const { connection } = require('./config/db');

const http = require('http');
const socketIo = require('socket.io');
const { userRouter } = require('./routes/user.routes');
const { taskRouter } = require('./routes/task.routes');
const { auth } = require('./middleware/auth');



const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());
app.use("/users",userRouter)
app.use("/task",auth,taskRouter)

io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  global.io = io;

app.listen(2029,async()=>{
    try{
     
   await connection
   console.log("connect to db")
    console.log('Server is running on port 2029');
    }
    catch(error){
        console.error(error);
    }
})

