import { useRouteError } from "react-router-dom";

type ErrorProps = {
    message?: string;
}

const ErrorPage = ({ message }: ErrorProps) => {
    const error = useRouteError();
    if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="max-w-lg">
            <p>{message}</p>
        </div>
    );
}

export default ErrorPage;
