import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
import Expense from "../Models/expenseModel.js";
const addMemberToGroup = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: "User name is required" });
  }

  const groupId = req.session.user.groupId;
  const newUser = new User({ name: userName, groupId: groupId });
  await newUser.save();

  const group = await Group.findById(groupId);
  group.groupMembers.push(newUser._id);
  await group.save();

  return res.status(201).json({
    message: "New user added to the group successfully",
    newUser,
  });
};


// Adding an expense BY a user TO other users

 const addExpense = async (req, res) => {
  try {
    const { title, expenseBy, expenseAmount, expenseFor } = req.body;
    const groupId = req.session?.user?.groupId; 

if (!groupId) {
  return res.status(400).json({ message: "User session or groupId is missing" });
}


    console.log( "group id is:" +  groupId);

    if (!expenseBy || !expenseAmount) {
      return res.status(400).json({ message: "Add payee and amount both" });
    }

    // Fetch the group
    const group = await Group.findById(groupId).populate("groupMembers");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Validate expenseBy (payer)
    const payer = await User.findOne({ name: expenseBy, groupId });
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
    const splitAmount = expenseAmount / splitAmong.length ;

    // Update payer (positive balance)
    payer.explited_amount +=(expenseAmount-splitAmount);

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
      .json({ message: "Expense added successfully", newExpense });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export { addMemberToGroup, addExpense };
