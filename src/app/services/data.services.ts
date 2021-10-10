import { Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppError } from "../common/error-handler/app-error";
import { NotFoundError } from "../common/error-handler/not-found-error";

export class DataService {
    constructor(
        @Inject(String) private url: string,
        private http: HttpClient
    ) {}

    public getAll(queryParams?: string): Observable<any> {
        return this.http
            .get(`${this.url}/${queryParams}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: Response) {
        if (error.status === 404) return throwError(new NotFoundError(error));
        return throwError(new AppError(error));
    }
}
