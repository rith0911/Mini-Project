import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";

const Project = ({ project }) => {
	//const { projectId } = useParams();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const isOwner = authUser._id === project.suggestedBy._id;

    const queryClient = useQueryClient();

    const { mutate: deleteProject, isPending: isDeletingProject } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/projects/delete/${project._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			toast.success("Project deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const handleDeleteProject = () => {
		if (!window.confirm("Are you sure you want to delete this project?")) return;
		deleteProject();
	};

    return (
		<div className='bg-secondary rounded-lg shadow mb-4'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center'>
						<Link to={`/profile/${project?.suggestedBy?.rollnumber}`}>
							<img
								src={project.suggestedBy.profileImg || "/avatar.png"}
								alt={project.suggestedBy.name}
								className='size-10 rounded-full mr-3'
							/>
						</Link>

						<div>
							<Link to={`/profile/${project?.suggestedBy?.rollnumber}`}>
								<h3 className='font-semibold'>{project.suggestedBy.name}</h3>
							</Link>
							<p className='text-xs text-info'>{project.suggestedBy.headline}</p>
							<p className='text-xs text-info'>
								{formatDistanceToNow(new Date(project.dateAdded), { addSuffix: true })}
							</p>
						</div>
					</div>
					{isOwner && (
						<button onClick={handleDeleteProject} className='text-red-500 hover:text-red-700'>
							{isDeletingProject ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
						</button>
					)}
				</div>
				<p className='mb-4 font-bold text-2xl'>{project.title}</p>
				<p className="mb-4 text-1xl">{project.description}</p>

				<div className='flex justify-between text-info'>
					<PostAction icon={<Share2 size={18} />} text='Share' />
				</div>
			</div>
		</div>
	);
};

export default Project;
	