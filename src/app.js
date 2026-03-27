const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express()

const authRouter =require("../src/routes/auth.routes")
const accountRouter = require("../src/routes/account.routes")
const transactionRouter = require("../src/routes/transaction.routes")
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

//routes

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transaction",transactionRouter)


module.exports = app

