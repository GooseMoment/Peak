import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import axios_config_defaults from '@api/config_defaults'
import router from '@/router'
import GlobalStyle from '@assets/GlobalStyle'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

axios_config_defaults()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <ToastContainer />
        <RouterProvider router={router} />
    </React.StrictMode>,
)