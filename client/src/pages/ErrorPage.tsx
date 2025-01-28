import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    let message = "unknown error";
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
