const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1 -- const name = req.query;
// Route params = /users/1 -- const name = req.params;
// Request body = { "name" : "Felipe", email: "fekawassaki@gmail.com"} -- const body = req.body;

const users = ["Felipe", "Lorayne", "Alan"];

server.use((req, res, next) => {
  console.time(`Request`);
  console.log(`Method: ${req.method}; URL ${req.url}`);
  next();
  console.timeEnd(`Request`);
  console.log(`Finished`);
});

// Middlewares
// Check required params
function checkUserNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: `User name is required` });
  }
  return next();
}

// Middlewares
// Check if are in array
function checkUserInArray(req, res, next) {
  const user = users[req.params.id];
  if (!user) {
    return res.status(400).json({ error: `User not found` });
  }
  req.user = user;
  return next();
}

// Find all users
server.get("/users", (req, res) => {
  return res.json(users);
});

// Find users by id
server.get("/users/:id", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Query params
server.get("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params; // --->   const id = req.params.id;
  return res.json({ message: `Finding user ${id}` });
});

// Route params
server.get("/test", (req, res) => {
  const { name } = req.query; // --->   const name = req.query.name;
  return res.json({ message: `Hello ${name}` });
});

// Post User
server.post("/users", checkUserNameExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

// Update User
server.put("/users/:id", checkUserNameExists, checkUserInArray, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  users[id] = name;
  return res.json(users);
});

// Delete User
server.delete("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params;
  users.splice(id, 1);
  return res.json(users);
});

// Start server on port 3000 (http://localhost:3000)
server.listen(3000);
