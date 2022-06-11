const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  console.log('users')
  console.log(users)

  const checkIfExist = users.find(user => user.username === username);
  if(!checkIfExist){
    return res.status(404).json({
      error: true,
      message: 'User not found',
    });
  }

  req.user = checkIfExist;
  next();
}

app.post('/users', (req, res) => {
  const { username, name } = req.body;

  if(!username){
    return res.status(400).json({
      error: true,
      message: 'The username field is required',
    });
  }
  if(!name){
    return res.status(400).json({
      error: true,
      message: 'The name field is required',
    });
  }

  const checkIsAlreadyExist = users.some(user => user.username === username);
  if(checkIsAlreadyExist){
    return res.status(400).json({
      error: true, 
      message: 'This username is already in use',
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return res.status(201).json({
    error: true,
    user: user,
  });

});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  
  const { todos } = req.user;

  return res.status(200).json({
    todos: todos,
  });

});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  
  const { todos } = req.user;
  const { title, deadline } = req.body;

  const todo = {
    title: title,
    id: uuidv4(),
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  }

  todos.push(todo);
  return res.status(201).json({
    todo: todo,
  });

});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;