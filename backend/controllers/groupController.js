import Group from "../Models/groupModel.js";

const createGroup = async (req, res) => {
  try {
    const { groupName} = req.body;

    const user= req.user;
     console.log(user);
    if (!groupName ) {
      return res.status(400).json({ message: "Enter Group Name" });
    }

    const newGroup = new Group({
      name: groupName,
      groupMembers: [user._id],
    });
    await newGroup.save();

    user.groupIds.push(newGroup._id);
    user.activeGroupId = newGroup._id;
    await user.save();

    await newGroup.populate("groupMembers");

    return res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { createGroup };