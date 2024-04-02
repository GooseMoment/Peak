import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'
import GlobalStyle from '@assets/GlobalStyle'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <ToastContainer position="bottom-left" stacked hideProgressBar />
        <RouterProvider router={router} />
    </React.StrictMode>,
)