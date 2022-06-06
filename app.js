const express = require('express');
const middleware=require('./middleware');

require('express-async-errors')

const app = express();

app.use(express.json());

const database=require('./database');

if(process.env.NODE_ENV !== 'test'){

    database.connect();

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
      }
      );

}

app.use('/todos', require('./routes/todo.routes'));

app.use(middleware.onlyError)


module.exports =app