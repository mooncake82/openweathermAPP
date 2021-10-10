import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { CitiesComponent } from "./cities.component";
import { WeatherService } from "./services/weather.services";
import { HttpClientModule } from "@angular/common/http";
import { from } from "rxjs";

const fakeWeatherService = {
    cnt: 5,
    list: [
        {
            coord: {
                lon: -118.2437,
                lat: 34.0522,
            },
            sys: {
                country: "US",
                timezone: -25200,
                sunrise: 1633874055,
                sunset: 1633915509,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            main: {
                temp: 18.82,
                feels_like: 18.22,
                temp_min: 16.09,
                temp_max: 24,
                pressure: 1018,
                humidity: 56,
            },
            visibility: 10000,
            wind: {
                speed: 0,
                deg: 0,
            },
            clouds: {
                all: 1,
            },
            dt: 1633882163,
            id: 5368361,
            name: "Los Angeles",
        },
        {
            coord: {
                lon: 139.6917,
                lat: 35.6895,
            },
            sys: {
                country: "JP",
                timezone: 32400,
                sunrise: 1633898631,
                sunset: 1633939916,
            },
            weather: [
                {
                    id: 801,
                    main: "Clouds",
                    description: "few clouds",
                    icon: "02n",
                },
            ],
            main: {
                temp: 22.1,
                feels_like: 22.53,
                temp_min: 16.95,
                temp_max: 24.75,
                pressure: 1019,
                humidity: 83,
            },
            visibility: 10000,
            wind: {
                speed: 1.34,
                deg: 156,
            },
            clouds: {
                all: 20,
            },
            dt: 1633882151,
            id: 1850144,
            name: "Tokyo",
        },
        {
            coord: {
                lon: -74.006,
                lat: 40.7143,
            },
            sys: {
                country: "US",
                timezone: -14400,
                sunrise: 1633863714,
                sunset: 1633904621,
            },
            weather: [
                {
                    id: 300,
                    main: "Drizzle",
                    description: "light intensity drizzle",
                    icon: "09d",
                },
            ],
            main: {
                temp: 17.35,
                feels_like: 17.44,
                temp_min: 15.46,
                temp_max: 18.92,
                pressure: 1021,
                humidity: 88,
            },
            visibility: 10000,
            wind: {
                speed: 0.89,
                deg: 105,
            },
            clouds: {
                all: 90,
            },
            dt: 1633882163,
            id: 5128581,
            name: "New York",
        },
        {
            coord: {
                lon: 2.3488,
                lat: 48.8534,
            },
            sys: {
                country: "FR",
                timezone: 7200,
                sunrise: 1633845796,
                sunset: 1633885894,
            },
            weather: [
                {
                    id: 801,
                    main: "Clouds",
                    description: "few clouds",
                    icon: "02d",
                },
            ],
            main: {
                temp: 16.74,
                feels_like: 16.17,
                temp_min: 15.56,
                temp_max: 17.43,
                pressure: 1026,
                humidity: 65,
            },
            visibility: 10000,
            wind: {
                speed: 2.24,
                deg: 68,
            },
            clouds: {
                all: 20,
            },
            dt: 1633882154,
            id: 2988507,
            name: "Paris",
        },
        {
            coord: {
                lon: -0.1257,
                lat: 51.5085,
            },
            sys: {
                country: "GB",
                timezone: 3600,
                sunrise: 1633846558,
                sunset: 1633886320,
            },
            weather: [
                {
                    id: 804,
                    main: "Clouds",
                    description: "overcast clouds",
                    icon: "04d",
                },
            ],
            main: {
                temp: 17.15,
                feels_like: 16.77,
                temp_min: 15.94,
                temp_max: 18.67,
                pressure: 1029,
                humidity: 71,
            },
            visibility: 10000,
            wind: {
                speed: 3.6,
                deg: 330,
            },
            clouds: {
                all: 100,
            },
            dt: 1633882155,
            id: 2643743,
            name: "London",
        },
    ],
};

describe("CitiesComponent", () => {
    let component: CitiesComponent;
    let fixture: ComponentFixture<CitiesComponent>;
    let service: WeatherService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CitiesComponent],
            providers: [WeatherService],
            imports: [HttpClientModule, RouterTestingModule],
        });
        fixture = TestBed.createComponent(CitiesComponent);
        component = fixture.componentInstance;
        service = TestBed.get(WeatherService);
        fixture.debugElement;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("CitiesList", () => {
        it("should initialise the cities property", () => {
            //ARRANGE
            let spy = spyOn(service, "getAll").and.callFake(() => {
                const obs = from(fakeWeatherService.list);
                return obs;
            });
            // ACT
            fixture.detectChanges();
            // ASSERTETION
            expect(spy).toHaveBeenCalled();
        });
    });
});
