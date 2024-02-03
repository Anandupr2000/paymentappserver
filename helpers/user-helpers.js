var db = require('../db/connect')
var collections = require('../db/collections')
var ObjectId = require("mongodb").ObjectId

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { generateEmailContentForOtp } = require('./email');

let otpStore = {};

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
    },
    sendOtp: (type = "mobileno", value = '8848081856') => { // value received will be mobile no or email depending on type
        return new Promise(async (resolve, reject) => {

            // user otps are stored in otpStore using userphn/email whichever is the value received as key values
            otpStore.value = {
                'otp': Math.floor(1000 + Math.random() * 9000),
                'expireTime': new Date().getTime() + 5 * 60 * 1000 // adding 5min to current time for expire
            }
            if (type == "mobileno") {
                var unirest = require("unirest");

                var request = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

                request.headers({
                    "authorization": "Q1aM5htITczBq70C4flmADjnV9W6JERbsKYPveSUHuLroi8XkgEsD5o1PvKfB2T3k6RFGVrdcilHCanb"
                });
                console.log(`OTP send is ${otpStore.value.otp}`);
                request.form({
                    "message": `Your otp for verification is ${otpStore.value.otp}, and will expire within 5 minutes`,
                    "language": "english",
                    "route": "q",
                    "numbers": value,
                });

                request.end(function (res) {
                    if (res.error) {
                        console.log(res.error);
                        reject({ optSend: false, error: res.error, 'otp': otpStore.value.otp })
                    }
                    console.log(res.body);
                    resolve({ optSend: true, 'otp': otpStore.value.otp, message: res.body.message[0] })
                    // res.json({ 'opt send': true, 'otp': otpStore.otp })
                });
            }
            else if (type == 'email') {
                // create transporter object with smtp server details
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: process.env.GMAIL_USERNAME,
                        pass: process.env.GMAIL_PWD
                    }
                });
                // send email
                let res = await transporter.sendMail({
                    from: 'hipay.app.payment@gmail.com',
                    to: 'ananduprajesh@gmail.com',
                    subject: 'Test Email Subject',
                    html: generateEmailContentForOtp(otpStore.value.otp) // value will phn no or email address
                });
                if (res.accepted) {
                    // console.log(res.response.match(/ok/i));
                    resolve({ success: true })
                }
                else if (res.rejected) {
                    reject({ success: false, res: res.response })
                }
            }
            else {
                reject({ optSend: false, error: "Unauthorized access" })
            }
        })
    },
    verifyUser: (otp, value = '8848081856') => {
        return new Promise((resolve, reject) => {
            if (Object.keys(otpStore).length === 0){
                reject({ optVerified: false, error: "Internal Server error",tip:"Try restarting server" })
                return
            }

            console.log("otp generated for user");
            console.log(Object.keys(otpStore).length === 0);
            if (new Date().getTime() > otpStore.value.expireTime)
                reject({ optVerified: false, error: "Unauthorized access" })
            if (otpStore.value.otp === otp)
                resolve({ success: true })
            else
                reject({ success: false, error: "Otp doesn't matches" })
        })
    }
}