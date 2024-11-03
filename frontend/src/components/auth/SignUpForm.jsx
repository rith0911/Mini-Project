import { useState } from "react";
import {useMutation} from '@tanstack/react-query';
import {axiosInstance} from '../../lib/axios.js';
import {toast} from 'react-hot-toast';
import {Loader} from 'lucide-react';

const SignUpForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [rollnumber, setRollNumber] = useState("");
	const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const {mutate: signUpMutation, isLoading} = useMutation ({
        mutationFn: async(data) =>{
            const res = await axiosInstance.post('/auth/signup',data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Account created Successfully');
        },
        onError:(err) => {
            toast.error(err.response.data.message || "Something went wrong");
        },
    });

	const handleSignUp = (e) => {
		e.preventDefault();
        signUpMutation({name, rollnumber, email, password, role});
	};

	return (
		<form onSubmit={handleSignUp} className='flex flex-col gap-4'>
			<input
				type='text'
				placeholder='Full name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='Roll Number'
				value={rollnumber}
				onChange={(e) => setRollNumber(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='faculty or student'
				value={role}
				onChange={(e) => setRole(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <button type="submit" disabled={isLoading} className="btn btn-success w-full text-white">
                {isLoading ? <Loader className='size-5 animate-spin' /> : "Register" }
            </button>
		</form>
	);
};
export default SignUpForm;