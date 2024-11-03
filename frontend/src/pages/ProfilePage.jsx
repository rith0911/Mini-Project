import React from 'react';
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import SkillsSection from "../components/SkillsSection";
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const {rollnumber} = useParams();
    const queryClient = useQueryClient();

    const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

    const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", rollnumber],
		queryFn: () => axiosInstance.get(`/users/profile/${rollnumber}`),
	});

    const {mutate: updatedProfile } = useMutation({
        mutationFn: async (updatedData) => {
            await axiosInstance.post('/users/update',updatedData);
        },
        onSuccess : () => {
            toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", rollnumber]);
        },
    });

    if(isLoading || isUserProfileLoading) return null;

    const isOwnProfile = authUser.rollnumber === userProfile.data.rollnumber;
    const userData = isOwnProfile ? authUser : userProfile.data;

    const handleSave = (updatedData) => {
        updatedProfile(updatedData)
    };

    return (
        <div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
		</div>
    );
};

export default ProfilePage;