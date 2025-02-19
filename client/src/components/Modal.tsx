import { PropsWithChildren } from "react";

type ModalProps = {
    onClose: () => void;
}

const Modal = ({ onClose, children }: PropsWithChildren<ModalProps>) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative bg-background rounded-md m-8 p-4">
                <button className="absolute top-6 right-6 cursor-pointer text-black hover:text-error transition-colors" onClick={onClose}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
