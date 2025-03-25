import Waitlist from "../Schema/WaitList.js";
import Lab from "../Schema/Lab.js";
import { Op } from "sequelize";



export const getWaitlist = async (req, res) => {
    try {
      const { lab_id } = req.params;
      console.log(lab_id);
      
      const waitlist = await Waitlist.findAll({
        where: { lab_id },
        include: {
          model: Lab,
          attributes: ["lab_name", "location"], 
        },
        order: [["id", "ASC"]],
      });
      res.status(200).json(waitlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  };
  


export const addToWaitlist = async (req, res) => {
  try {
    const { user_name, lab_id } = req.body;

    const lastEntry = await Waitlist.findOne({
      where: { lab_id },
      order: [["id", "DESC"]],
    });

    const newPosition = lastEntry ? lastEntry.id + 1 : 1;
    const estimatedWaitTime = `${newPosition * 10} mins`; 

    const newEntry = await Waitlist.create({
      user_name,
      lab_id,
      estimated_wait_time: estimatedWaitTime,
      notified: false,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to waitlist" });
  }
};

export const removeFromWaitlist = async (req, res) => {
    try {
      const { lab_id, user_name } = req.params;
  
      const entry = await Waitlist.findOne({ where: { lab_id, user_name } });
      if (!entry) return res.status(404).json({ error: "Waitlist entry not found" });
  
      await entry.destroy();
  
      await Waitlist.decrement("id", {
        where: { lab_id, id: { [Op.gt]: entry.id } },
      });
  
      res.status(200).json({ message: "User removed from waitlist" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from waitlist" });
    }
  };
  
