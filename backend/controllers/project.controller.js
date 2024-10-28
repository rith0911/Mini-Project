import Project from "../models/projects.model.js";

export const suggestProject = async (req,res)=>{
    const {title, description} = req.body;
    const project = new Project({
        title, description, suggestedBy: req.user._id,
    });

    await project.save();
    res.status(201).json(project);
};

export const getProjects = async (req,res) =>{
    const projects = await Project.find({
        status: 'suggested'
    }).sort({dateAdded: -1});

    res.json(projects);
};

export const markProject = async (req,res) =>{
    const {id} = req.params;
    try {
        const project = await Project.findById(id);
        if(!project) {
            return res.status(404).json({ message: "Project not found"});
        }
        project.status = 'completed';
        await project.save();
        res.json(project);
    } catch (error) {
        console.log("Error in markProject controller: ",error.message);
        res.status(500).json({error: error.message});
    }
}