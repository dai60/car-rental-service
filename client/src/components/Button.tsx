import { PropsWithChildren } from "react";
import { ClassName } from "../utilities";

type ButtonProps = {
    submit?: boolean;
    onClick?: React.MouseEventHandler;
} & ClassName;

const Button = ({ className = "", submit = false, onClick, children }: PropsWithChildren<ButtonProps>) => {
    return (
        <button type={submit ? "submit" : undefined}
            onClick={onClick}
            className={"font-semibold py-1 min-w-32 rounded-md cursor-pointer hover:opacity-80 transition-opacity " + className}>
            {children}
        </button>
    );
}

export default Button;
