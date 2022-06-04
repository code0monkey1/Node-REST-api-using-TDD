const request = require('supertest')

const app = require('../../app')

const database = require('../../database')

const endpointUrl = '/todos'

const newTodo= require('../mock-data/new-todo.json')

const allTodos = require('../mock-data/all-todos.json')

const TodoModel=require('../../models/todo.model');


beforeAll(async () => {
     await database.connect()
})

beforeEach(async () => {

   await TodoModel.deleteMany();
})


describe(endpointUrl, () => {

  it("POST "+endpointUrl, async () => {
     
   const response= await request(app)
    .post(endpointUrl)
    .send(newTodo)

    expect(response.statusCode).toBe(201)

    expect(response.body.message.title).toStrictEqual(newTodo.title)
    expect(response.body.message.done).toStrictEqual(newTodo.done)

  })

  it("should return 500 on malformed data",async()=>{

    const response= await request(app)
    .post(endpointUrl)
    .send({
      title:"test"
    })
 
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toStrictEqual("Todo validation failed: done: Path `done` is required.")
  })

  it('should get 2 todos with the proper content', async ()=>{
      
    await request(app)
        .post(endpointUrl)
        .send(allTodos)
    
        const response = await request(app)
        .get(endpointUrl)


      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.message)).toBeTruthy()

      expect(response.body.message.length).toBe(allTodos.length)

      expect(response.body.message[0].title).toStrictEqual(allTodos[0].title)
      expect(response.body.message[0].done).toStrictEqual(allTodos[0].done)

      expect(response.body.message[1].title).toStrictEqual(allTodos[1].title)
      expect(response.body.message[1].done).toStrictEqual(allTodos[1].done)
      
  })

  it('should get a single todo', async ()=>{
      
    const todoResponse = await request(app)
        .post(endpointUrl)
        .send(newTodo)

    console.log("The id is",todoResponse.body.message._id)
    const response = await request(app)
        .get(`${endpointUrl}/${todoResponse.body.message._id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message.title).toStrictEqual(allTodos[0].title)
    expect(response.body.message.done).toStrictEqual(allTodos[0].done)

    })

  it('should return 404 if todo not found', async ()=>{

    const response = await request(app)
        .get(`${endpointUrl}/6298d1ad808e7919c972c41f`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toStrictEqual("Todo not found")

  }
  )

  it('should update the todo with the given body', async ()=>{

    const todoResponse = await request(app)
        .post(endpointUrl)
        .send(newTodo)
    
    const modifiedTodo={
          title:"new title",
          done:true
        }

    const response = await request(app)
        .put(`${endpointUrl}/${todoResponse.body.message._id}`)
        .send(modifiedTodo)
    
    expect(response.statusCode).toBe(200)
    expect(response.body.message.title).toStrictEqual(modifiedTodo.title)
    expect(response.body.message.done).toStrictEqual(modifiedTodo.done)
  })

  it('should give appropriate message with 404 statusCode when given invalid id', async ()=>{

    const response = await request(app)
        .put(`${endpointUrl}/6298d1ad808e7919c972c41f`)
        .send({
          title:"new title",
          done:true
        })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toStrictEqual("Todo not found")

  })

  it('should delete the todo with the given id', async ()=>{
      
      const todoResponse = await request(app)
          .post(endpointUrl)
          .send(newTodo)

      const response = await request(app)
          .delete(`${endpointUrl}/${todoResponse.body.message._id}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.message.title).toStrictEqual(newTodo.title)
      expect(response.body.message.done).toStrictEqual(newTodo.done)
    
  }
  )

  it('should give appropriate message with 404 statusCode when given invalid id', async ()=>{
      
      const response = await request(app)
          .delete(`${endpointUrl}/6298d1ad808e7919c972c41f`)
  
      expect(response.statusCode).toBe(404)
      expect(response.body.message).toStrictEqual("Todo not found")
  
    }
  )

})

afterAll(() => {
  database.disconnect()
}
)
