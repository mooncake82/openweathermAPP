import { AppError } from "./app-error";

export class NotFoundError extends AppError {
    public message = "Not found";
}
