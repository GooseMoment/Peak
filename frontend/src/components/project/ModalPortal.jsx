import { createPortal } from "react-dom";
import { useEffect } from "react";

const ModalPortal = ({ children }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.querySelector('html').scrollTop = window.scrollY;
            return () => document.body.style.overflow = null;
        }, []);

    const el = document.getElementById("modal");
    return createPortal(children, el);
};

export default ModalPortal;