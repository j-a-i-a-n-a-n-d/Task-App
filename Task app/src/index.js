const express = require('express')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')
const dbconnect = require("./db/connect");
const dotenv = require("dotenv");
dotenv.config();
dbconnect();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
    console.log("Server is Listening on Port", PORT);
})