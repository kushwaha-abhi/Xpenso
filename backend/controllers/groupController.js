import Group from "../Models/groupModel.js";
import User from "../Models/userModel.js";

const createGroup = async (req, res) => {
  try {
    const { groupName, userName } = req.body;

    if (!groupName || !userName) {
      return res.status(400).json({ message: "Group name and at least one member are required" });
    }

    const newUser = new User({ name: userName });
    await newUser.save();

    const newGroup = new Group({
      name: groupName,
      groupMembers: [newUser._id],
    });
    await newGroup.save();

    newUser.groupIds.push(newGroup._id);
    newUser.activeGroupId = newGroup._id;
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      groupId: newUser.groupId,
    };

    await newGroup.populate("groupMembers");

    return res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { createGroup };