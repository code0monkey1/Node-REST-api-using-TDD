const todoController=require('../../controllers/todo.controller');
const TodoModel=require('../../models/todo.model');
const httpMocks = require('node-mocks-http');

const newTodo=require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

// TodoModel.create =jest.fn();

jest.mock('../../models/todo.model')

const saveMock = jest.fn();
TodoModel.prototype.save = saveMock;

let req,res,next;

beforeEach(() => {
  
      req=httpMocks.createRequest()
      res=httpMocks.createResponse()
      next=jest.fn();

      TodoModel.deleteMany();
});

describe("TodoController.SaveTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should have a saveTodo function", () => {
    expect(typeof todoController.saveTodo).toBe("function");
  });

  it.skip("should call TodoModel.save", () => {
    todoController.saveTodo(req, res, next);
    expect(saveMock).toHaveBeenCalled();
  });
});

  describe('getTodo', () => {

    beforeEach(() => {
            req.body=newTodo;
    });

    it('should have a get todo function', () => {
      expect(typeof todoController.getTodo).toBe('function');
    });

    it('should call the TodoModel.create() ) method', () => {
 
      todoController.createTodo(req,res,next);
      expect(TodoModel.create).toBeCalledWith(newTodo);
    }
    )

    it('should return response code of 201',async() => {
      await todoController.createTodo(req,res,next);
       expect(res.statusCode).toBe(201);

       

    })

    it('should return response body with newTodo',async() => {

        TodoModel.create.mockReturnValue(newTodo);
      
        await  todoController.createTodo(req,res,next);

        expect(res._getJSONData()).toStrictEqual({success:true,message:newTodo});
    }
    )

    it('should handle error',async() => {
      
        const errorMessage ={message:'done property missing'};

        const rejectedPromise= Promise.reject(errorMessage)

        TodoModel.create.mockReturnValue(rejectedPromise);

        await todoController.createTodo(req,res,next);

        expect(next).toBeCalledWith(errorMessage);
  });

  }
  )

  describe('getTodos', () => {

     
   it('should return all todos with response code 200', async () => {


        TodoModel.find.mockReturnValue(allTodos);

         await todoController.getTodos(req,res,next);

        expect(TodoModel.find).toBeCalledWith();

        expect(res.statusCode).toBe(200);

        expect(res._getJSONData()).toStrictEqual({success:true,message:allTodos});
      
        expect(res._getJSONData().message).toHaveLength(allTodos.length);

   })

    it('should handle error',async() => {

        const errorMessage ={message:'not able to find todos'};

        const rejectedPromise= Promise.reject(errorMessage)

        TodoModel.find.mockReturnValue(rejectedPromise);

        await todoController.getTodos(req,res,next);

        expect(next).toBeCalledWith(errorMessage);

  })

   it('should have getTodo method called with specific id in findById method',async() => {
         const id=1;

        req.params.id = id
       await todoController.getTodo(req,res,next);
    
       expect(TodoModel.findById).toBeCalledWith(id);
   })

   it('should return a single todo when given a valid id and a valid code 200',async() => {
       
        TodoModel.findById.mockReturnValue(newTodo);
  
        await todoController.getTodo(req,res,next);

        expect(res.statusCode).toBe(200);

        expect(res._isEndCalled()).toBe(true);
  
        expect(res._getJSONData()).toStrictEqual({success:true,message:newTodo});
  
   })

    it('should do error handling',async() => {

      const errorMessage = {message:'Error message'};

      const rejectedPromise= Promise.reject(errorMessage)

      TodoModel.findById.mockReturnValue(rejectedPromise);

      await todoController.getTodo(req,res,next);

      expect(next).toBeCalledWith(errorMessage);
       

      }
      )

    it('should return 404 in case the todoItem does not exist',async() =>{
         
        TodoModel.findById.mockReturnValue(null);

        await todoController.getTodo(req,res,next);
        
        expect(res._isEndCalled()).toBe(true);

        expect(res.statusCode).toBe(404);

        expect(res._getJSONData()).toStrictEqual({success:false,message:'Todo not found'});
           
    })

    it('updateToDo function exists',async() => {

        expect(typeof todoController.updateTodo).toBe('function');

    })

    it('should call put with a valid id and body',async() => {
        
        const id=1;
        req.body=newTodo
        req.params.id = id
        await todoController.updateTodo(req,res,next);
    
       expect(TodoModel.findByIdAndUpdate).toBeCalledWith(id,newTodo,{new:true});

    })

    it('should return a response with a success message for update',async() => {
        
          TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);

          await todoController.updateTodo(req,res,next);

          expect(res._isEndCalled()).toBe(true);

          expect(res.statusCode).toBe(200);

          expect(res._getJSONData()).toStrictEqual({success:true,message:newTodo});

    })

    it('should handle error',async() => {

        const errorMessage = {message:'Error message'};

        const rejectedPromise= Promise.reject(errorMessage)

        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await todoController.updateTodo(req,res,next);

        expect(next).toBeCalledWith(errorMessage);
       

      }
    )

    it('should return 404 in case the todoItem does not exist',async() =>{

        TodoModel.findByIdAndUpdate.mockReturnValue(null);

        await todoController.updateTodo(req,res,next);

        expect(res._isEndCalled()).toBe(true);

        expect(res.statusCode).toBe(404);

        expect(res._getJSONData()).toStrictEqual({success:false,message:'Todo not found'});

    })

    it('deleteTodo function exists',async() => {
        
          expect(typeof todoController.deleteTodo).toBe('function');
  
      }
      )

      it('should call delete with a valid id',async() => {
            
            const id=1;
            req.params.id = id
            await todoController.deleteTodo(req,res,next);
        
           expect(TodoModel.findByIdAndDelete).toBeCalledWith(id);
    
        }
        )
      
      it('should return a response with a success message for delete',async() => {
              
                TodoModel.findByIdAndDelete.mockReturnValue(newTodo);

                await todoController.deleteTodo(req,res,next);

                expect(res._isEndCalled()).toBe(true);

                expect(res.statusCode).toBe(200);

                expect(res._getJSONData()).toStrictEqual({success:true,message:newTodo});

      })

      it('should handle error',async() => {
          
          const errorMessage = {message:'Error message'};
  
          const rejectedPromise= Promise.reject(errorMessage)
  
          TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
  
          await todoController.deleteTodo(req,res,next);
  
          expect(next).toBeCalledWith(errorMessage);
        
  
        }
      )

      it('should return 404 in case the todoItem does not exist',async() =>{

        TodoModel.findByIdAndDelete.mockReturnValue(null);

        await todoController.deleteTodo(req,res,next);

        expect(res._isEndCalled()).toBe(true);

        expect(res.statusCode).toBe(404);

        expect(res._getJSONData()).toStrictEqual({success:false,message:'Todo not found'});

      })

  }
  )
 

  
