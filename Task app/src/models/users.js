const mongoose = require("mongoose");
const validator = require("validator");
const User = mongoose.model('User', {
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
    }
})

module.exports = User;