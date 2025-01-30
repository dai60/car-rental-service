import { PropsWithChildren } from "react";
import { ClassName } from "../utilities";

type ButtonProps = {
    submit?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
} & ClassName;

const Button = ({ className = "", disabled = false, submit = false, onClick, children }: PropsWithChildren<ButtonProps>) => {
    return (
        <button type={submit ? "submit" : undefined}
            disabled={disabled}
            onClick={onClick}
            className={
                `font-semibold py-1 min-w-32 rounded-md cursor-pointer disabled:cursor-default 
                not-disabled:hover:opacity-80 disabled:grayscale-50 transition ${className}`}>
            {children}
        </button>
    );
}

export default Button;
