import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'
import GlobalStyle from '@assets/GlobalStyle'

<<<<<<< HEAD
import { initClientSettings } from '@utils/clientSettings'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// initilize client-side settings
initClientSettings()
=======
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
>>>>>>> 2ceba5dca70d57cbfd4a78273c4d744a13b09634

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <ToastContainer position="bottom-left" stacked hideProgressBar />
        <RouterProvider router={router} />
    </React.StrictMode>,
)