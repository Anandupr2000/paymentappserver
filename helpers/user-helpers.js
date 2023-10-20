var db = require('../db/connect')
var collections = require('../db/collections')
var ObjectId = require("mongodb").ObjectId

const bcrypt = require('bcrypt')

module.exports = {
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            resolve(await db.get().collection(collections.USER_COLLECTION).find().toArray())
        })
    },
    findUser: keyword => {
        return new Promise(async (resolve, reject) => {
            const projection = {
                _id: 0, // Exclude the _id field
                name: 1, // Include specific fields you want
                phn: 1,
            };
            console.log(keyword);
            // console.log(typeof keyword);
            // console.log(typeof "keyword");
            let users = await db.get().collection(collections.USER_COLLECTION)
                .find(
                    {
                        $or: [
                            {
                                name: { $regex: keyword, $options: 'i' }
                            },
                            {
                                phn: { $regex: keyword, $options: 'i' }
                            }
                        ]
                    },
                    projection
                ).toArray()
            resolve({ success: true, users: users })
        })
    },
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email });
            if (user) {
                console.log(user);
                reject({ error: "User with email already registered" })
            }
            user = await db.get().collection(collections.USER_COLLECTION).findOne({ phn: userData.phn });
            if (user) {
                console.log(user);
                reject({ error: "User with phone number already registered" })
            }
            // bcrypt can be used to encrypt user password
            userData.pwd = await bcrypt.hash(userData.pwd, 10) // wait untill hash value is produced

            // adding dummy rupees for demo transaction
            userData.balance = 10.0;
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data) // return of promise
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ phn: userData.phn });
            let response = {}
            if (user) {
                bcrypt.compare(userData.pwd, user.pwd)
                    .then((status) => {
                        if (status) {
                            console.log("Login sucess")
                            response.user = user
                            response.success = true
                            resolve(response)
                        }
                        else {
                            console.log("Login failed")
                            // returning object status inside response like object , with only one key-value pair 
                            reject({ status: false, err: "Login failed due to incorrect credentials" })
                        }
                    })
            }
            else {//if no user found with email
                console.log("No user found with " + userData.email)
                // returning object status inside response like object , with only one key-value pair
                reject({ error: "Register yourself first" })
            }
        })
    }
}