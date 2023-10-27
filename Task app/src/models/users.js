const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Task = require('./tasks');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique : true,
        validate(val) {
            if (!validator.isEmail(!val))
                throw new Error("Invalid Email");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (!validator.isStrongPassword(val))
                throw new Error("Weak Password Input again");
        }
    },
    age: {
        type: Number,
        default: 0,
        required: false,
        validate(val) {
            if (val < 0 || val > 100)
                throw new Error("Enter Valid Age", val);
        }
    },
    //array
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


//instance methods 
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//hashing the password before storing it
userSchema.pre('save', async function (next) {
    // const user = this
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

//deleting before remove method is called 
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User;