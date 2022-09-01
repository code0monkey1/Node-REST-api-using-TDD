const express = require('express');
const middleware=require('./middleware');

require('express-async-errors')

const app = express();


app.use(express.json({limit: '10mb'}));


const database=require('./database');

if(process.env.NODE_ENV !== 'test'){

    database.connect();

    const port = process.env.PORT || 3000;
    app.listen(3000, () => {
        console.log(`Example app listening on port ${port}!`);
      }
      );

}

app.use('/todos', require('./routes/todo.routes'));

app.use(middleware.onlyError)


module.exports =app