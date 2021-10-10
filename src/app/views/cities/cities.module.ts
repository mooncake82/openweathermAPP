import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CitiesComponent } from "./cities.component";
import { WeatherService } from "./services/weather.services";
import { SharedModule } from "../../common/shared.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: "", component: CitiesComponent }]),
    ],
    exports: [CitiesComponent],
    declarations: [CitiesComponent],
    providers: [WeatherService],
})
export class CitiesModule {}
