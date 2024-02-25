const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();

const todoSchema = Joi.object({
  title: Joi.string().min(6).required(),
  content: Joi.string().min(15).required(),
  label: Joi.string().min(4).required(),
});
const schemaValidator = (body) => {
  return todoSchema.validate(body);
};
const schema = new mongoose.Schema({
  title: String,
  content: String,
  label: String,
});

const Todo = mongoose.model("Todo", schema);

router.post("/", async (req, res) => {
  const { error } = schemaValidator(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const todo = new Todo({
      title: req.body.title,
      content: req.body.content,
      label: req.body.label,
    });
    const savedTodo = await todo.save();
    return res.status(201).send(savedTodo);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    return res.send(deletedTodo);
  } catch (error) {
    return res.status(404).send("Todo does not found");
  }
});

async function getTodos(req) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const note = await Todo.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort("title")
    .select("title label content");
    
  const paginatedItems = note.slice(startIndex, endIndex);

  return paginatedItems;
}
router.get("/", async (req, res) => {
  const data = await getTodos(req);
  return res.send(data);
});
router.get("/:id", async (req, res) => {
  try {
    const todoById = await Todo.findById(req.params.id);
    return res.send(todoById);
  } catch (error) {
    return res.status(404).send("Please provide a valid ID");
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { title, content, label } = req.body;
    if (!title && !content && !label) {
      return res.status(400).send("ERROR: Missing required field");
    }
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).send("ERROR: Todo not found");
    } else {
      todo.title = title ? title : todo.title;
      todo.content = content ? content : todo.content;
      todo.label = label ? label : todo.label;
      todo.save();
      return res.send(todo);
    }
  } catch (error) {
    return res.status(404).send("Error: Failed in update");
  }
});

module.exports = router;
