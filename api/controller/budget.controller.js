const {budgetValidation} = require("../validations/budget.validation");
const {Budget} = require("../models/budget");
const {Users} = require("../models/users");

async function createBudget(req,res){
    const data = req.body
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        } else {
            const { error, value } = budgetValidation(data);
            if (error) {
                return res.status(400).json({ msg: error.details[0].message })
            } else {
                budget_exists = await Budget.findOne({ name: value.name })
                if (budget_exists) {
                    return res.status(400).json({ msg: `budget with ${value.name} already exists` })
                } else {
                    const budget = new Budget({ user_id: req.params.id, ...value });
                    budget.save((error,data)=>{
                        if(error){
                            console.error(error);
                            return res.status(400).json(error);
                        }else{
                            return res.status(201).json(data);
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }
}

async function getBudgets(req,res){
    try {
        const user = await Users.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }else{
            const budgets = await Budget.find({user_id:req.params.id}).sort({createdAt:"desc"})
            return res.status(200).json(budgets)
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }

}

async function getBudget(req,res){
    try {
        const user = await Users.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }else{
            const budget = await Budget.findById(req.params.bu_id);
            if(!budget){
                return res.status(404).json({msg:"Budget not found"});
            }else{
                return res.status(200).json(budget);
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }

}
async function editBudget(req,res){
    try {
        const user = await Users.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }else{
            data = req.body
            Budget.findByIdAndUpdate(req.params.bu_id,data,{new:true}, (err, data)=>{
                if(err){
                    console.log(err)
                    return res.status(400).json({msg:"Budget could not be updated"})
                }
                return res.status(200).json(data)
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }


}
async function deleteBudget(req,res){
    try {
        const user = await Users.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }else{
            Budget.findByIdAndDelete(req.params.bu_id,(err, data)=>{
                if (err){
                    console.log(err)
                    return res.status(400).json({msg:"Budget could not be deleted"})
                }
                return res.status(200).json({msg:"Budget deleted successfully",data:data})
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }


}
async function deleteAllBudgets(req,res){
    try {
        const user = await Users.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }else{
            Budget.deleteMany({user_id:req.params.id},(err, data)=>{
                if (err){
                    console.log(err)
                    return res.status(400).json({msg:"Budget could not be deleted"})
                }
                return res.status(200).json({msg:"Budget deleted successfully",data:data})
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"An Error Occured"});
    }


}


module.exports = {
    createBudget,
    getBudgets,
    getBudget,
    editBudget,
    deleteBudget,
    deleteAllBudgets
}