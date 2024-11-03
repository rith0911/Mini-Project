import Departments from "../models/departments.model.js";
import User from "../models/user.model.js";

export const createDepartment = async(req,res) =>{
    const{name, description} = req.body;
    try{
      const user = await User.findById(req.user._id);
      if(user.role.toString() !== "faculty" ){
        return res.json({message: "Not authorized to create department"});
      }
        const department = new Departments(
          {
            name , 
            description,
            author: user._id,
          }
        );
        await department.save();

        res.json({success: true, department});
    } catch(err){
        console.log("Error in createDepartment controller: ", err.message);
        res.status(500).json({message: err.message});
    }
};

export const getDepartments = async (req,res) =>{
    try {
        const department = await Departments.find();
        res.json({success: true, department});
    } catch (error) {
        res.status(500).json({error: 'Error on getDepartments controller'});
    }
};

export const updateDepartment = async (req,res) =>{
    const { departmentId } = req.params;
  const { name, description } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const departments = await Departments.findById(departmentId);
    if(user._id.toString() === departments.author._id.toString() ){
      return res.status(400).json({error: 'Only creater can update'});
    }
    
    const department = await Departments.findByIdAndUpdate(
      departmentId,
      { name, description },
    );

    if (!department) {
        return res.status(404).json({message: 'Department not found' });
    }
    res.json({department});
  } catch(error){
    console.log('Error in update Department controller:', error.message);
    res.status(500).json({message: 'Error updating department', error});
  }
};