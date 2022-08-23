const http = require('https');
const {accountSetup, transactions} = require('../utils/product_functions');
const {BankAccount} = require('../models/bank');
const mongoose = require('mongoose');
const SEC = process.env.MONO_SEC
const options = {
    hostname: 'api.withmono.com',
    headers: {
      'Content-Type': 'application/json',
      'mono-sec-key': SEC
    },
  };


async function bankConnect(req, res){
    const {code} = req.body
    accountSetup(code,req,res)
    
}
async function getAccounts(req,res){
    const accounts = await BankAccount.find({user_id:req.params.id}).select('-_id').sort({createdAt:"desc"})
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
        const id = mongoose.Types.ObjectId(req.params.id)
        const result = await BankAccount.aggregate(
            [
                {$match:{user_id:id}},
                {$group:{_id:"user_id", totalBalance:{$sum:"$accountBalance"}}}
            ]
        )
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

async function getStatement(req,res){
    let period = req.query.period;
    let output = req.query.output;
    if(!period){
        return res.status(401).json({msg:"specify a period in your query"})
    }
    if(output){
        options.path = `/accounts/${req.params.acc_id}/statement?period=${period}&output=${output}`
    }else{
        options.path = `/accounts/${req.params.acc_id}/statement?period=${period}`
    }
    
    options.method = 'GET'
    let data = '';
    try{
        const request = http.request(options, (response)=>{
            response.on('data',(chunk)=>{data = data + chunk})
            response.on('end', async()=>{
                let statement = JSON.parse(data);
                return res.status(200).json(statement)
            })
        })
        request.on('error', (error)=>{
            console.log(error);
            return res.status(500).json({msg:error})
        })
        request.end();
    }catch(error){
        return res.status(500).json({msg:error})
    }
    
}

async function getCredits(req,res){
    options.path = `/accounts/${req.params.acc_id}/credits`
    options.method = 'GET'
    let data = '';
    try {
        const request = http.request(options, (response) => {
            response.on('data', (chunk) => { data = data + chunk })
            response.on('end', async () => {
                let credits = JSON.parse(data);
                // credits.history = JSON.parse(data).history.map((credit)=>{return credit.amount/100;});
                return res.status(200).json(credits)
            })
        })
        request.on('error', (error) => {
            console.log(error);
            return res.status(500).json({ msg: error })
        })
        request.end();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error })
    }
}

async function getDebits(req,res){
    options.path = `/accounts/${req.params.acc_id}/debits`
    options.method = 'GET'
    let data = '';
    try {
        const request = http.request(options, (response) => {
            response.on('data', (chunk) => { data = data + chunk })
            response.on('end', async () => {
                let debits = JSON.parse(data);
                return res.status(200).json(debits)
            })
        })
        request.on('error', (error) => {
            console.log(error);
            return res.status(500).json({ msg: error })
        })
        request.end();
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}

module.exports = {
    bankConnect, 
    getTotalBalance, 
    getTransactions, 
    getTransaction, 
    getBalance,
    getAccounts,
    getAccount,
    getStatement,
    getCredits,
    getDebits
    
}
