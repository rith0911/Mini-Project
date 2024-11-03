import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ProjectCreation = ({ user }) => {
    const [title, setTitle] = useState("");
    const [description, setDescripition] = useState("");

    const queryClient = useQueryClient();

    const { mutate: createProjectMutation, isPending } = useMutation({
		mutationFn: async (projectData) => {
			const res = await axiosInstance.post("/projects/suggestProject", projectData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Project suggested successfully");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to suggest Project");
		},
	});

    const handleProjectCreation = async () => {
		try {
			const projectData = { title, description };

            createProjectMutation(projectData);
		} catch (error) {
			console.error("Error in handleProjectCreation:", error);
		}
	};

    const resetForm = () => {
		setTitle("");
		setDescripition("");
		
	};

	return (
		<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
            <h2 className="w-full p-3 font-bold">Share your Ideas</h2>
			<div className='flex space-x-3 '>
				<img src={user.profileImg || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
				<textarea
					placeholder="Title of the Project"
					className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
                <textarea
					placeholder="Description of the project"
					className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
					value={description}
					onChange={(e) => setDescripition(e.target.value)}
				/>
			</div>

			<div className='flex justify-between items-center mt-4'>

				<button
					className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
					onClick={handleProjectCreation}
					disabled={isPending}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
				</button>
			</div>
		</div>
	);
}

export default ProjectCreation;
