const tranactionModel = require("../models/transaction.models")
const ledgerModel = require("../models/ledger.models")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")


/**
 * -- CREATE A NEW TRANSACTION --
 * 1. VALIDATE REQUEST
 * 2.VALIDATE IDEMPOTENCY KEY
 * 3.CHECK ACCOUNT STATUS
 * 4.DERIVE SENDER BALANCE FROM USER
 * 5.CREATE TRANSACTION (PENDING)
 * 6.CREATE DEBIT LEDGER (ENTRY)
 * 7.CREATE CREDIT LEDGER (ENTRY)
 * 8.MARK TRANSACTION COMPLETED 
 * 9.COMMIT MONGO_DB SESSION
 * 10.SEND EMAIL NOTIFICATION
 */


async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "fromAccount, toAccount, amount and idempotencyKey are required" })
    }


    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!fromUserAccount) {
        return res.status(404).json({ message: "From Account not found" })
    }
    if (!toUserAccount) {
        return res.status(404).json({ message: "To Account not found" })
    }


    // validate idempotency key

    const isTransactionExist = await tranactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionExist) {
        if (isTransactionExist.status === "COMPLETED") {
            return res.status(200).json({ message: "Transaction already processed", transaction: isTransactionExist })
        }

        if (isTransactionExist.status === "PENDING") {
            return res.status(200).json({ message: "Transaction is being processed", transaction: isTransactionExist })
        }

        if (isTransactionExist.status === "FAILED") {
            return res.status(200).json({ message: "Transaction failed in previous attempt, retrying now", transaction: isTransactionExist })
        }

        if (isTransactionExist.status === "REVERSED") {
            return res.status(200).json({ message: "Transaction was reversed in previous attempt, retrying now", transaction: isTransactionExist })

        }
    }

    //check account status

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({ message: "Both accounts must be active to process the transaction" })
    }

    // derive sender balance from user

     


}
async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "toAccount, amount and idempotencyKey are required" })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAccount) {
        return res.status(404).json({ message: "To Account not found" })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(404).json({ message: "System account not found for the user" })
    }

    const session = await mongoose.startSession()
    session.startSession()

    const transaction = new tranactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = new ledgerModel([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = new ledgerModel([{
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    await debitLedgerEntry.save({ session })  // ✅ Fix 2
    await creditLedgerEntry.save({ session }) // ✅ Fix 2
    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({ message: "Initial funds transaction created successfully", transaction: transaction })
}


module.exports = {
    createTransaction,
    createInitialFundsTransaction
}
