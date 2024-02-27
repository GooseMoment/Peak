import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
    const el = document.getElementById("modal");
    return createPortal(children, el);
};

export default ModalPortal;