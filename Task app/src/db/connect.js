const  mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connect = () => {
    const uri = `mongodb://localhost:${ process.env.DATABASE_PORT }/task-app`; 
    mongoose.connect(uri, {
        useNewUrlParser: true,    
        useUnifiedTopology: true,
    })

    //
    //
    mongoose.connection.on("connected", () => {
        console.log("Connected with database on ", uri);
    })
    mongoose.connection.on("error", () => {
        console.log("Error connecting to Database");
    })
}
module.exports = connect;