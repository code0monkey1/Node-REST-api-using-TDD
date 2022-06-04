const router = require('express').Router();
const todoController=require('../controllers/todo.controller');


router.post('/',todoController.createTodo);
router.get('/',todoController.getTodos);
router.get('/:id',todoController.getTodo);
router.put('/:id',todoController.updateTodo);
router.delete('/:id',todoController.deleteTodo);

module.exports=router;
