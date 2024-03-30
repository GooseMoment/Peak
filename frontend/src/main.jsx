import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'
import GlobalStyle from '@assets/GlobalStyle'

import { initClientSettings } from '@utils/clientSettings'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <ToastContainer />
        <RouterProvider router={router} />
    </React.StrictMode>,
)