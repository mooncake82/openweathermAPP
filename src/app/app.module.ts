import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { CitiesModule } from "./views/cities/cities.module";
import { ToastrModule } from "ngx-toastr";
import { AppErrorHandler } from "./common/error-handler/app-error-handler";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CitiesModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
    ],
    providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
    bootstrap: [AppComponent],
})
export class AppModule {}
