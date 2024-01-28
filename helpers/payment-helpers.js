var db = require('../db/connect')
var collections = require('../db/collections')
var ObjectId = require("mongodb").ObjectId
var TimeStamp = require("mongodb").Timestamp

module.exports = {
    doPayment: (senderPhn, receiverPhn, payment) => {
        return new Promise(async (resolve, reject) => {

            let senderBalance = (await db.get().collection(collections.USER_COLLECTION).findOne({ phn: senderPhn })).balance
            let receiverBalance = (await db.get().collection(collections.USER_COLLECTION).findOne({ phn: receiverPhn })).balance
            console.log({ senderBalance, receiverBalance })

            // sender balance deducting
            let deductResponse = await db.get().collection(collections.USER_COLLECTION)
                .updateOne({ phn: senderPhn }, { $set: { balance: senderBalance - payment } })
            // console.log(deductResponse)
            // receiver balance crediting
            let creditResponse = await db.get().collection(collections.USER_COLLECTION)
                .updateOne({ phn: receiverPhn }, { $set: { balance: receiverBalance + payment } })
            // console.log(creditResponse)
            // preparing transaction data
            let tData = {
                sender: senderPhn,
                receiver: receiverPhn,
                time: TimeStamp,
                senderBalanceBefore: senderBalance,
                senderBalanceAfter: senderBalance - payment,
                receiverBalanceBefore: receiverBalance,
                receiverBalanceAfter: receiverBalance + payment
            }
            await db.get().collection(collections.TRANSACTION_COLLECTION).insertOne(tData)
            resolve({ success: true, newBalance: senderBalance - payment })
        })
    },
    getTransactions: (userPhn = '9089781232') => {
        return new Promise(async (resolve, reject) => {
            console.log("search transaction history for 9089781232");
            let transactions = await db.get().collection(collections.TRANSACTION_COLLECTION).find({ sender: userPhn }).toArray()
            // console.log(transactions);
            resolve({ 'success': true, 'transactions': transactions })
        })
    }
}