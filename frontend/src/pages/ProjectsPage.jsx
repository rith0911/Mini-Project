import React from 'react';
import ProjectCreation from '../components/ProjectCreation';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import { Users } from "lucide-react";
import Project from '../components/Project.jsx';


const ProjectsPage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	// const { data: recommendedUsers } = useQuery({
	// 	queryKey: ["recommendedUsers"],
	// 	queryFn: async () => {
	// 		const res = await axiosInstance.get("/users/suggested");
	// 		return res.data;
	// 	},
	// });

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const res = await axiosInstance.get("/projects");
			return res.data;
		},
	});

	console.log("projects", projects);

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<ProjectCreation user={authUser} />

				{projects?.map((project) => (
					<Project key={project._id} project={project} />
				))}

				{projects?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Projects Yet</h2>
						<p className='text-gray-600 mb-6'>Suggest Some New Projects</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectsPage;