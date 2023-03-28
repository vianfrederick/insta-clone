require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 5000;
const authenticateRouter = require('./routes/authenticate');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
  });

app.use(cors());
app.use(express.json());

app.use('/', authenticateRouter);
app.use('/',postsRouter);
app.use('/', usersRouter);


app.listen(port, () => {
  console.log(`Server started at Port ${port}`);
});
