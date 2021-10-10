import { DataService } from "../../../services/data.services";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WeatherService extends DataService {
    public iconUrl = "http://openweathermap.org/img/wn";
    constructor(http: HttpClient) {
        super(`https://api.openweathermap.org/data/2.5`, http);
    }
}
