import { lazy } from "react"
import { redirect } from "react-router-dom"

import { lazily } from "react-lazily"

const SignInForm = lazy(() => import("@components/sign/SignInForm"))
const TOTPAuthForm = lazy(() => import("@components/sign/TOTPAuthForm"))

const { SignUpForm, SignUpComplete } = lazily(
    () => import("@components/sign/signUpForms"),
)

const { PasswordRecoveryForm, PasswordRecoveryRequestForm } = lazily(
    () => import("@components/sign/passwordRecoveryForms"),
)

const { EmailVerificationForm, EmailVerificationResendForm } = lazily(
    () => import("@components/sign/emailVerificationForms"),
)

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
        path: "two-factor/totp",
        element: <TOTPAuthForm />,
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
