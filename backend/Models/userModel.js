import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
   unique:true,
  required: true,
  
  },
  password: {
    type: String,
    // required: true,
  },
  explited_amount: {
    type: Number,
    default:0,
  },
  payees: [
    {
      name: {
        type: String,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  activeGroupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  token: { type: String }, 
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
