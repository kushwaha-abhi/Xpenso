import Group from "../Models/groupModel.js";

const createGroup = async (req, res) => {
  try {
    const { groupName} = req.body;

    const user= req.user;
     console.log( "user is" + user);
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

    return res.status(201).json({ success:true, message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateActiveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = req.user;

    if (!user.groupIds.includes(groupId)) {
      return res.status(403).json({ message: "Unauthorized: Not a member of this group" });
    }

    user.activeGroupId = groupId;
    await user.save();

    return res.status(200).json({ success:true, message: "Active group updated", activeGroupId: groupId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




const listGroups = async (req, res) => {
  try {
    const user = req.user;
    const groups = await Group.find({ _id: { $in: user.groupIds } });
    res.status(200).json({
      success:true,
      groups
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export { createGroup,listGroups, updateActiveGroup };