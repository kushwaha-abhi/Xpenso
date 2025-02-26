import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
import Expense from "../Models/expenseModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Login or register a user

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    let user = await User.findOne({ name });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({ name, password: hashedPassword, groupIds: [] });
      await user.save();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.token = token;
    await user.save();

    return res
      .status(200)
      .json({
        success:true,
        message: "Login successful", token, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// add member to group

const addMemberToGroup = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: "User name is required" });
  }

  const exixtUser= await User.findOne({name:userName});
  if(exixtUser){
    return res.status(400).json({ message: "User already exist" })
  };

  console.log("User Object:", req.user);
  console.log("Active Group ID:", req.user?.activeGroupId);
  
  const groupId  = req.user.activeGroupId;
  
  const newUser = new User({ name: userName, });
  await newUser.save();

  const group = await Group.findById(groupId);
     console.log(group);
  group.groupMembers.push(newUser._id);
  await group.save();

  newUser.groupIds.push(groupId);
  newUser.activeGroupId =groupId;

  newUser.save();
  return res.status(201).json({
    success:true,
    message: "New user added to the group successfully",
    newUser,
  });
};

// Adding an expense BY a user TO other users

const addExpense = async (req, res) => {
  try {
    const { title, expenseBy, expenseAmount, expenseFor } = req.body;

    const groupId = req.user.activeGroupId;

      console.log("group id is:" + groupId);

    if (!groupId) {
      return res
        .status(400)
        .json({ message: "User session or groupId is missing" });
    }

    console.log("group id is:" + groupId);

    if (!expenseBy || !expenseAmount) {
      return res.status(400).json({ message: "Add payee and amount both" });
    }

    // Fetch the group
    const group = await Group.findById(groupId).populate("groupMembers");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Validate expenseBy (payer)
    const payer = await User.findOne({ name: expenseBy, activeGroupId: groupId });
    if (!payer) {
      return res.status(404).json({ message: "Payer not found" });
    }

    // Get members to split the expense
    let splitAmong = [];
    if (expenseFor && expenseFor.length > 0) {
      splitAmong = await User.find({ _id: { $in: expenseFor }, groupId });
      if (splitAmong.length !== expenseFor.length) {
        return res
          .status(400)
          .json({ message: "Some selected users are not in the group" });
      }
    } else {
      splitAmong = group.groupMembers;
    }

    if (splitAmong.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid users to split the expense" });
    }

    // Calculate split amount
    const splitAmount = expenseAmount / splitAmong.length;

    // Update payer (positive balance)
    payer.explited_amount += expenseAmount - splitAmount;

    // Update debt for each participant
    for (let user of splitAmong) {
      if (user.name === expenseBy) continue; // Skip payer

      user.explited_amount -= splitAmount;

      // Update payee records
      let existingPayee = user.payees.find((payee) => payee.name === expenseBy);
      if (existingPayee) {
        existingPayee.amount -= splitAmount;
        if (existingPayee.amount === 0) {
          user.payees = user.payees.filter((payee) => payee.name !== expenseBy);
        }
      } else {
        user.payees.push({ name: expenseBy, amount: -splitAmount });
      }

      await user.save();
    }

    await payer.save();

    // Create and save expense
    const newExpense = new Expense({
      title,
      expenseBy,
      expenseAmount,
      expenseFor: splitAmong.map((user) => user._id),
      date: new Date(),
    });

    await newExpense.save();

    group.expenses.push(newExpense._id);

    await group.save();

    return res
      .status(201)
      .json({ success:true, message: "Expense added successfully", newExpense });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};



// Take Overview of all the expenses

const takeOverView = async (req, res) => {
  try {
    const groupId = req.user.activeGroupId;
    const group = await Group.findById(groupId).populate("groupMembers");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json({ success:true, users: group.groupMembers });
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};



// List expenses

const listExpenses = async (req, res) => {
  try {
    const groupId = req.user.activeGroupId;
    const group = await Group.findById(groupId).populate("expenses");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json({success:true,  expenses: group.expenses });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  } 
};

export { addMemberToGroup, addExpense, loginUser,takeOverView, listExpenses };
