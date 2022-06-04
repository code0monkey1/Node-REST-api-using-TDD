const TodoModel = require('../models/todo.model');


exports.getTodo =async (req,res,next) => {


  const id = req.params.id;

  try{
    const todo = await TodoModel.findById(id);
     
    if(!todo){
  
      return res.status(404).json({success:false,message:'Todo not found'});
    }

    res.status(200).json({ success: true, message:todo });
  }
  catch(err){
    next(err);
  }

}

exports.getTodos = async (req,res,next) => {

  try{

    const todos = await TodoModel.find();
    res.status(200).json({ success: true, message:todos });

  }
  catch(err){
    next(err);
  }
}

exports.createTodo = async (req,res,next) => {

  try{
  
    const createdTodo = await TodoModel.create(req.body)

   return res.status(201).json({success:true,message:createdTodo});
  }
  catch(err){
    next(err);
  }
  
   
}

exports.updateTodo = async (req,res,next) => {
  
    try{
      const id = req.params.id;
      const updatedTodo = await TodoModel.findByIdAndUpdate(id,req.body,{new:true});
      
      if(!updatedTodo){
        return res.status(404).json({success:false,message:'Todo not found'});
      }
      res.status(200).json({success:true,message:updatedTodo});
    }
    catch(err){
      next(err);
    }
}

exports.deleteTodo = async (req,res,next) => {

  try{
    const id = req.params.id;
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    
    if(!deletedTodo){
      return res.status(404).json({success:false,message:'Todo not found'});
    }
    res.status(200).json({success:true,message:deletedTodo});
  }
  catch(err){
    next(err);
  }
}