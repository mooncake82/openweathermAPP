export interface IOpenWeather {
    cnt: number;
    list: IWList[];
}

export interface IWList {
    coord: {
        lon: number;
        lat: number;
    };
    sys: {
        country: string;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
    weather: IWeather[];
    main: IWListMain;
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    id: number;
    name: string;
    date: any;
    hours: any;
}

export interface IWeather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface IWListMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}
