import { PropsWithChildren } from "react";
import { ClassName } from "../utilities";

type ButtonProps = {
    onClick?: React.MouseEventHandler;
} & ClassName;

const Button = ({ className = "", onClick, children }: PropsWithChildren<ButtonProps>) => {
    return (
        <button
            onClick={onClick}
            className={"font-semibold py-1 min-w-32 rounded-md cursor-pointer hover:opacity-80 transition-opacity " + className}>
            {children}
        </button>
    );
}

export default Button;
