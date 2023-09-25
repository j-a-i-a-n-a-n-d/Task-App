const express = require('express')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')
const dbconnect = require("./db/connect");
const dotenv = require("dotenv");
const User = require("./models/users");
dotenv.config();
dbconnect();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.post("/users", (request, response) => {
    const user = new User(request.body);
    user
        .save()
        .then(() => {
            response.status(201);
            response.send(user);
        })
        .catch((e) => {
            response.send(400);
            response.send(e);
        })

})


app.listen(PORT, () => {
    console.log("Server is Listening on Port", PORT);
})



//



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'Red12345!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('red12345!', hashedPassword)
    console.log(isMatch)
}

myFunction()