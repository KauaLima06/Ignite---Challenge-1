const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const checkIfExist = users.find(user => user.username === username);
  if(!checkIfExist){
    return res.status(404).json({
      error: 'User not found',
    });
  }

  req.user = checkIfExist;
  next();
}

app.post('/users', (req, res) => {
  const { username, name } = req.body;

  if(!username){
    return res.status(400).json({
      error: 'The username field is required',
    });
  }
  if(!name){
    return res.status(400).json({
      error: 'The name field is required',
    });
  }

  const checkIsAlreadyExist = users.find(user => user.username === username);
  if(checkIsAlreadyExist){
    return res.status(400).json({
      error: 'This username is already in use',
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return res.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  
  const { todos } = req.user;

  return res.status(200).json(todos);

});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  
  const { todos } = req.user;
  const { title, deadline } = req.body;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  todos.push(todo);
  return res.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  
  const { todos } = req.user;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const todo = todos.find(todo => todo.id === id);
  if(!todo){
    return res.status(404).json({
      error: true,
      message: 'Todo not found',
    });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.status(200).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { todos } = req.user;

  const todo = todos.find(todo => todo.id === id);
  if(!todo){
    return res.status(404).json({
      error: true,
      error: 'Todo not found',
    });
  }

  todo.done = true;
  return res.status(200).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { todos } = req.user;

  const todo = todos.find(todo => todo.id === id);
  if(!todo){
    return res.status(404).json({
      error: 'Todo not found',
    });
  }

  todos.splice(todo, 1);
  return res.status(204).send();
});

module.exports = app;