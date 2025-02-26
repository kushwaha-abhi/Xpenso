import mongoose from "mongoose";
const generateInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let inviteCode = '';
  for (let i = 0; i < 8; i++) {
    inviteCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return inviteCode;
};
const groupSchema = new mongoose.Schema({
   name:{
    type:"String",
    required:true,
   },
   groupMembers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   }],
   expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
  }],
   inviteCode:{
    type:"String",
    default:generateInviteCode,
   },
});

const Group= mongoose.models.Group ||  mongoose.model("Group", groupSchema);

export default Group;