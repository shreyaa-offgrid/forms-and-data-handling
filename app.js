const express = require('express');
const app = express();
const path = require('node:path');
const usersRouter = require('./routes/usersRouter');
const morgan = require('morgan');

//app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use('/',usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error)=>{
  if(error){
    throw error;
  }
  console.log(`express app listening on port ${PORT}`);
});
