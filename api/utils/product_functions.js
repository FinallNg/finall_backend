// Product Functionality
const http = require('https');
const { bankValidation } = require('../validations/bank.validation')
const { BankAccount } = require('../models/bank');
const SEC = process.env.MONO_SEC
const options = {
    hostname: 'api.withmono.com',
    headers: {
      'Content-Type': 'application/json',
      'mono-sec-key': SEC
    },
  };




async function accountSetup(code,req,res){
    options.path = '/account/auth'
    options.method = 'POST'
    payload = {code:code}
    const request = http.request(options, function(response){
        let data = ''
        response.on('data',(chunk)=>{data = data + chunk})
        response.on('end',async function(){
            id = JSON.parse(data).id;
            getBankDetails(id,req,res,storeBankDetails)
        })
    })
    request.on('error', (error)=>{
        console.log(error);

    })
    request.write(JSON.stringify(payload));
    request.end();
};

async function getBankDetails(id,req,res,cb){
    options.path = `/accounts/${id}`
    options.method = 'GET'
    let data = '';
    const request = http.request(options, (response)=>{
        response.on('data',(chunk)=>{data = data + chunk})
        response.on('end',async()=>{
            details = JSON.parse(data);
            cb(req,res,details);
        })
    })
    request.on('error', (error)=>{
        console.log(error);
    })
    request.end();
};

async function storeBankDetails(req,res,details){
    const bank = {};
    BankAccount.findOne({user_id:req.params.id,bankName:details.account.institution.name},(error, data)=>{
        if (error){
            console.log(error)
            return res.status(500).json({msg:error.message})
        }
        if (data){
            data.accountBalance = details.account.balance
            data.save()
            return res.status(200).json({data:data})
        }
        if(!data){
            if (details.meta.data_status=='AVAILABLE'){
                bank.user_id=req.params.id;
                bank.account_id=details.account._id;
                bank.bankName=details.account.institution.name;
                bank.accountType=details.account.type;
                bank.currency=details.account.currency;
                bank.accountName=details.account.name;
                bank.accountNumber=details.account.accountNumber;
                bank.accountBalance=details.account.balance;
                bank.bvn=details.account.bvn;
                const {error, value} = bankValidation(bank);
                if (error){
                    console.log(error)
                    return res.status(400).json({msg:error.details[0].message});
                }else if(value){
                    const bankDetails = new BankAccount(bank);
                    bankDetails.save();
                    return res.status(201).json({data:bankDetails});
                }
            }
        }
        

    })
    


};


async function transactions(req,res){
    let currentPage = req.query.page==undefined ? 1 : Number(req.query.page)
    let url,previousPage, nextPage, paging;
    if(process.env.ENVIRONMENT=="production"){
        url=process.env.URL + "/api/v1/users/"
    }else if(process.env.ENVIRONMENT=="development"){
        url=process.env.URL + "/api/v1/users/"
    }
    previousPage = currentPage-1==0 ? null : url + `${req.params.id}/accounts/${req.params.acc_id}/transactions` + "?page=" + `${currentPage-1}`
    nextPage = url + `${req.params.id}/accounts/${req.params.acc_id}/transactions` + "?page=" + `${currentPage+1}`
    
    options.path = currentPage==1 ? `/accounts/${req.params.acc_id}/transactions` : `/accounts/${req.params.acc_id}/transactions?page=${currentPage}`
    paging = {
        page:currentPage,
        previous:previousPage,
        next:nextPage
    }
    options.method = 'GET'
    let data = '';
    try {
        const request = http.request(options, (response)=>{
            response.on('data',(chunk)=>{data = data + chunk})
            response.on('end',async()=>{
                let transactions = JSON.parse(data);
                paging.total = transactions.paging.total
                return res.status(200).json({paging:paging,data:transactions.data})
            })
        })
        request.on('error', (error)=>{
            console.log(error);
        })
        request.end();
        
    } catch (error) {
        return res.status(500).json({msg:error})
    }
 

}


module.exports = {
    accountSetup,
    transactions
}