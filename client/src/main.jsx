import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root.jsx'
import Home from './routes/Home.jsx'
import CustomerLogin from './routes/CustomerLogin.jsx'
import SalonLogin from './routes/SalonLogin.jsx'
import SalonVerify from './routes/SalonVerify.jsx'
import NearbySalons from './routes/NearbySalons.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login/customer', element: <CustomerLogin /> },
      { path: 'login/salon', element: <SalonLogin /> },
      { path: 'login/salon/verify', element: <SalonVerify /> },
      { path: 'nearby', element: <NearbySalons /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
