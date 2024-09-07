import { redirect } from "react-router-dom"

import { lazily } from "react-lazily"

const {
    SignInForm,
    SignUpForm,
    SignUpComplete,
    PasswordRecoveryForm,
    PasswordRecoveryRequestForm,
    EmailVerificationForm,
    EmailVerificationResendForm,
} = lazily(() => import("@components/sign/forms"))

const signChildren = [
    {
        index: true,
        loader: () => redirect("/sign/in"),
    },
    {
        path: "in",
        element: <SignInForm />,
    },
    {
        path: "up",
        element: <SignUpForm />,
    },
    {
        path: "up-complete",
        element: <SignUpComplete />,
    },
    {
        path: "password-recovery",
        element: <PasswordRecoveryForm />,
    },
    {
        path: "request-password-recovery",
        element: <PasswordRecoveryRequestForm />,
    },
    {
        path: "verification",
        element: <EmailVerificationForm />,
    },
    {
        path: "verification-resend",
        element: <EmailVerificationResendForm />,
    },
]

export default signChildren
