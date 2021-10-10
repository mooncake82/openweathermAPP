import { Component, OnInit, OnDestroy } from "@angular/core";
import { WeatherService } from "./services/weather.services";
import { environment } from "../../../environments/environment";
import { IOpenWeather, IWList } from "./interfaces";
import { AppError } from "../../common/error-handler/app-error";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";

@Component({
    selector: "cities",
    templateUrl: "./cities.component.html",
    styleUrls: ["./cities.component.scss"],
})
export class CitiesComponent implements OnInit, OnDestroy {
    public cities: IWList[] = [];
    public imgUrl: string;
    public isLoading: boolean;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: WeatherService) {}

    public  getCities(ids: string[]): void {
        this.isLoading = true;
        this.service
            .getAll(
                `group?id=${ids.join(",")}&units=metric&appid=${
                    environment.apiKey
                }`
            )
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(
                (response: IOpenWeather) => {
                    this.cities = response.list;
                    this.imgUrl = this.service.iconUrl;
                },
                (error: AppError) => {
                    throw error;
                }
            );
    }

    public getCityForecast(current: IWList): void {
        this.isLoading = true;
        this.service
            .getAll(
                `forecast?q=${current.name}&units=metric&appid=${environment.apiKey}`
            )
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe((response) => {
                console.log("getCityForecast", response);
            });
    }
    
    public ngOnInit(): void {
        const ids: string[] = [
            "5368361",
            "1850144",
            "5128581",
            "2988507",
            "2643743",
        ];
        this.getCities(ids);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
