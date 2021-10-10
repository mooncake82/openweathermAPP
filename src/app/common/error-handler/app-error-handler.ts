import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(private zone: NgZone, private injector: Injector) {}
    public handleError(error: any): void {
        this.zone.run(() => {
            const toastr: ToastrService = this.injector.get(ToastrService);
            const message: string = error.message || "Oops! Something went wrong...";
            toastr.error(error.originalError.status, message, {
                timeOut: 2500,
                progressBar: true,
            });
        });
    }
}
