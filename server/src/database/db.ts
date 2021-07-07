//import * as bcrypt from "bcrypt"
import mongoose, { ConnectOptions, Mongoose } from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGOURI: string = process.env.MONGOURI || undefined
const collection = "memetecaDB"
const userCollection = "users"
const uniqueValidator = require('mongoose-unique-validator')
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    fName: { type: String, required: true},
    lName: { type: String, required: true },
    mail: { type: String, required: true, index: true, unique: true },
    pass: { type: String, required: true }

})

userSchema.plugin(uniqueValidator, {message: 'is already taken.'})
var config = {

    db: {
        native_parser: true
    },

    // This block gets run for a non replica set connection string (eg. localhost with a single DB)
    server: {
        poolSize: 5,
        reconnectTries: Number.MAX_VALUE,
        ssl: false,
        sslValidate: false,
        socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000
        }
    },

    // This block gets run when the connection string indicates a replica set (comma seperated connections)
    replset: {
        auto_reconnect: false,
        poolSize: 10,
        connectWithNoPrimary: true,
        ssl: true,
        sslValidate: false,
        socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000
        }
    }
};


async  function connect() {
    const options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        poolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      };


        console.log("Connecting")
        console.log(MONGOURI)
        mongoose.connect(MONGOURI, options).then( ()=> {
            console.log("Connection Succesful")
        }).catch( () =>  {
            (err) => console.error(err);
        })

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
      // we're connected!
            console.log("connected")
    
        });

   
}


export const User =  mongoose.connection.models[userCollection] || mongoose.model(userCollection, userSchema)

async function display_users(){  
    User.find((err, res) => {
        if (err) return console.log(err)
        console.log(res)
        return res
    })
}
/*
userSchema.pre( save, function(next) {
    
})*/
/*
try {
    let data = await User.findOne({username: user});
    if(!data) {
      throw new Error('no document found');
    }
    return data;
} catch (error) {
    return 0;
}
*/

/*  ----------- REGISTER  -------------------- */


/*  ----------- LOGIN -------------------- */ 

async function searchUserQuery(userMail) {
    var promise = await User.findOne({mail: userMail}).exec()
    return promise
}


async function loginUser(email: string, pass: string) { 
    /* 
let data;
interface myUser {
    mail: String,
    password: String
}

const logUser = new User({
    mail: email,
    password: pass
})

let userData = await User.findOne({mail: email}).exec((err,user) => {
    console.log(user)
    return JSON.stringify(user);
    });

    console.log("mydata" + userData)
*/ 

try {
    var promise = await searchUserQuery(email) 
    return promise;

} catch (err) {
    if (err) console.error("User not found")
    return null;
}
}


export {loginUser, connect, display_users} 