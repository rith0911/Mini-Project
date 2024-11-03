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

export const deleteProject = async (req, res) => {
	try {
		const projectId = req.params.id;
		const userId = req.user._id;

		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		// check if the current user is the suggester of project
		if (project.suggestedBy.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}
	
		await Project.findByIdAndDelete(projectId);

		res.status(200).json({ message: "Project deleted successfully" });
	} catch (error) {
		console.log("Error in delete project controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};