import { createBrowserRouter } from 'react-router-dom'
import LayoutPublic from '../layout/LayoutPublic'
import Jobs from '../pages/jobs/Jobs'
import PostJobs from '../pages/postJobs/PostJobs'
import Welcome from '../pages/welcome/welcome'
import Register from '../pages/register/Register'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutPublic/>,
        children: [
            {
                index: true,
                element: <Welcome/>
            },
            {
                path: '/jobs',
                element:<Jobs/>
            },
            {
                path: '/postjobs',
                element: <PostJobs/>
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    }
])