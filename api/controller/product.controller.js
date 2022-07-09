const {accountSetup, transactions} = require('../utils/product_functions')
const {BankAccount} = require('../models/bank')

async function bankConnect(req, res){
    const {code} = req.body
    accountSetup(code,req,res)
    
}
async function getAccounts(req,res){
    const accounts = await BankAccount.find({user_id:req.params.id}).select('-_id')
    if(accounts){
        return res.status(200).json(accounts)
    }
}

async function getAccount(req,res){
    const account = await BankAccount.findOne({user_id:req.params.id, account_id:req.params.acc_id}).select('-_id')
    if(account){
        return res.status(200).json(account)
    }else{
        return res.status(404).json({msg:"Account not found"})
    }
}

async function getTotalBalance(req,res){
    try {
        const result = await BankAccount.aggregate([{$group:{_id:{user_id:req.params.id}, totalBalance:{$sum:"$accountBalance"}}}])
        totalBalance = result[0].totalBalance
        if (totalBalance){
            return res.status(200).json({totalBalance})
        }
    } catch (error) {
        return res.status(500).json({msg:error})
    }
   
}

async function getTransactions(req,res){
    transactions(req,res)
}

async function getTransaction(req,res){}

async function getBalance(req,res){
    const balance = await BankAccount.findOne({user_id:req.params.id, account_id:req.params.acc_id},{accountBalance:1, _id:0})
    if (balance){
        return res.status(200).json(balance)
    }else{
        return res.status(400).json({msg:"Please Try Again"})
    }
}



module.exports = {
    bankConnect, 
    getTotalBalance, 
    getTransactions, 
    getTransaction, 
    getBalance,
    getAccounts,
    getAccount
}
