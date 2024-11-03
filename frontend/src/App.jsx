import Layout from "./components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from './pages/auth/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import NetworkPage from "./pages/NetworkPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import ProfilePage from './pages/ProfilePage';
import PostPage from "./pages/PostPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProjectsPage from './pages/ProjectsPage';


function App() {

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

  if(isLoading) return null;

  return <Layout>
    <Routes>
      <Route path='/' element={ authUser ? <HomePage /> : <Navigate to={'/login'} /> } />
      <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to= {"/"} /> } />
      <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to={"/"} /> } />
	  <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
	  <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
	  <Route path='/projects' element={authUser ? <ProjectsPage /> : <Navigate to={"/login"} />} />
	  <Route path='/profile/:rollnumber' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} /> } />
	  <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
    </Routes>

    <Toaster />
  </Layout>;
}

export default App;