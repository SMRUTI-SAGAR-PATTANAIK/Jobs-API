const { func } = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Please provide a name'],
        validate: {
            validator: function(value) {
                let length = value.length;
                let minLength = 3, maxLength = 50;
                if(length >= minLength && length <= maxLength) {
                    return true;
                }
                return false;
            },
            message: function(prop) {
                let length = prop.value.length;
                let minLength = 3;
                if(length < minLength) {
                    return `${prop.value} is too short for ${prop.path}`;
                } else {
                    return `${prop.value} is too long for ${prop.path}`;
                }
            }
        }
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: function(value) {
                let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isCorrectMail = value.toLowerCase().match(regex);
                return isCorrectMail;
            },
            message: function(prop) {
                return `${prop.value} is not valid ${prop.path}`
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        validate: {
            validator: function(value) {
                let length = value.length;
                let minLength = 6, maxLength = Number.POSITIVE_INFINITY;
                if(length >= minLength && length <= maxLength) {
                    return true;
                }
                return false;
            },
            message: function(prop) {
                let length = prop.value.length;
                let minLength = 6;
                if(length < minLength) {
                    return `${prop.value} is too short for ${prop.path}`;
                } else {
                    return `${prop.value} is too long for ${prop.path}`;
                }
            }
        }
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({userId:this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);