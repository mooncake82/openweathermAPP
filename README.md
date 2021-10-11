# TouchNote

## Introduction

Using the **<strike>DarkSky</strike>** (it's not anymore availbale)  [OpenWeather API](https://openweathermap.org), build a singular page web app which shows the current weather in the following cities: London, Paris, New York, Los Angeles, and Tokyo.

Each ciy should displays: 

* Temperature	
* Humidity
* Chance of Rain

>**Things you should know**: after finding out that [DarkSky](https://darksky.net/dev) is  no longer accepting new signups, I looked for another free weather API and *OpenWeather* seems to be very poplar among the dev commumity so I gave it go. There's an issue though, the <u>JSON is not returning the chance of rain</u>. I looked a lot for this issue and I could not find a clear answer: it seems this prop. is optional or it comes only with the business version. Even the day/hour *forecastAPI* does not return this prop.

## Requirements

* Create an online source control (Github, Bitbucket, etc.) project where this code will be hosted.
* Create an <strike>Angular 8</strike> Angular app using the Angular CLI.
* Focus on code design - think in terms of adaptability and extensibility.
* Handle errors appropriately.


### Bonus

* Data management with RxJS (Observables, Subjects, etc) 
* Material Design/Bootstrap integration
* Responsive design
* Provide tests via Jest, Mocha, etc, or any other framework


# Show me what you got


## Architecture

- src
	- app
		- commom
		- services
		- views
		- app.component.ts
		- app.component.scss
		- app.component.html
		- app-routing.module.ts
		- app.module.ts

>By **views** I mean the directory where I keep the components attached to a route (It's an old habit from AngularJS);
>By **common** I mean the directory where I keep stuff used by multiple components. Lots of devs call it *shared* folder.  


We want to show 5 cities and display the current weather for each one of them. 

1. `ng g c views/cities`

	Now we have our component and as we know Angular is *module* driven, so let's create a module for the cities component.

2. `touch cities.module.ts`

	This is very useful not only to keep our codebase clean but also to implements tha *lazyloading*. 

3. Back to the `app-routing.module`:

	```
	const routes: Routes = [
	    {
	        path: "cities",
	        loadChildren: () =>
	            import("./views/cities/cities.module").then((m) => m.CitiesModule),
	    },
	];
	
	```
	
	>In this way all the dependecies necessary to run the cities components will be loaded only when we hit the route *cities*.
	

4. Our `cities.module.ts` will look something like this:

	```
	import { NgModule } from '@angular/core';
	
	import { NameComponent } from './name.component';
	
	@NgModule({
	    imports: [],
	    exports: [],
	    declarations: [NameComponent],
	    providers: [],
	})
	export class NameModule { }
	```


## Services

It's time now to get some data from our API! 

1. `touch services/data.service.ts`. Here will store all the methods to make our http request:

	```
	import { Inject } from '@angular/core';
	import { HttpClient } from '@angular/common/http';
	import { Observable } from 'rxjs';
	
	export class DataService {
	    constructor(
	        @Inject(String) private url: string,
	        private http: HttpClient
	    ) { }
	
	    public getAll(): Observable<object> {
	        return this.http.get(this.url);
	    }
	}
	```

2. Back to cities `mkdir services && touch services/weather.services.ts`.

	This is what we got inside our cities folder so far:
	
	- cities
		- cities.component.html
		- cities.component.css
		- cities.component.ts
		- cities.module.ts
		- interfaces.ts
		- services
			- weather.services.ts
	
	It's time to add some logic to our new service
	
	```
	import { DataService } from "../../../services/data.services";
	import { HttpClient } from "@angular/common/http";
	import { Injectable } from "@angular/core";
	
	@Injectable()
	export class WeatherService extends DataService {
	    constructor(http: HttpClient) {
	        super(`https://api.openweathermap.org/data/2.5`, http);
	    }
	}
	```
	
	> Now this service inherits all the props of the `DataService`
	
	
## API & Rxjs


We can find the city we are looking for, either by providing the city's name or id

```
api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
```
Now because we want to fetch the weather for 5 cities all at once I studied the API's interface and I found out we can do something like this:

```
api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric
```

It works but we want to make this call more **flexible** so I've decided to pass an array of id as argument:

```
this.service.getAll(
        `group?id=${ids.join(",")}&units=metric&appid=${
            environment.apiKey
        }`
    )


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
```
Now when we want to show the weather for a new city we just need to add a new `id` to our array.



### Consuming the API

OK. As promised it's time to fetch some data:

```
	private destroyed$: Subject<boolean> = new Subject();

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
                    
                });
    }
    
    public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
}
```

Because we are dealing with Observable, it's very important to always unsubscribe, otherwise we might endup with memory leak.

There's more than a way to do that but the best practice is to use `takeUntil()` and unsubscribe from http calls when the component is destroyed.


## HandlingErrors

We have 2 types of Errors:

#### Unexpected Error
- **Server is offline**: *so the client sent a req to th eserver but the server is not open running to respond*
- **Network is Down**: *the server is online but the client cannot reach it*
- **Unhandled exceptions**: *the server is open running, the network is fine but because of some bug we fail to call the server*

#### Expected Error

- "Not Found" errors `404`
- "Bad Request" `400`

In order to simulate an error we change wrong our `url`. Now let's handle this error:

```
    public getCities(ids: string[]): void {
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
                (error: Response) => {
                    if (error.status === 404) {
                        alert("Not found");
                    } else {
                        alert("An unxpected error occured!");
                    }
                }
            );
    }
```

We want to move this piece of logic out from our component.

```
(error: Response) => {
     if (error.status === 404) {
```

So back to our `data.service` here in the `getAll ` method if there's an exception I want to catch the error obj - which is an instance of the `Response ` class - and then returning a different kind of error which is specific to our application. 


```
   public getAll(): Observable<object> {
        return this.http.get(this.url).pipe(catchError())
    }
```

`catchError()` return a new observable that has an error.

> What's the type of that error?

The type should be something specific to our application **not the response object.**

So we need to create a new class to represent *application specific error*.

1. `mkdir common`
2. `touch common/app-error.ts`

	```
	export class AppError {
	  constructor() { }
	}
	```
3. We pass it as arg.

	```
	   public getll(): Observable<object> {
        return this.http.get(this.url).pipe(catchError((error: Response) => {
            return throwError()
        }))
    }
	    
	```
	
	It's a good practice to include the **original error** bacause somewhere we are gonna get that error anf log it on the server.

4. Back to `app-error.ts`

	```
		export class AppError {
	  		constructor(public originalError?: any) { }
		}
	```
	
	This will be a field in our class that we can access when logging this error


5. Now back to `data.service` we can pass the original error obj as args in `new AppError(error)`


	```
	    public getll(): Observable<object> {
	        return this.http.get(this.url).pipe(catchError((error: Response) => {
	            return throwError(new AppError(error))
	        }))
	    }
	```
	

Now we need to change this implementation and check for the `status ` of the error.
So if it's `404` we want to return a different kind of error; because in our component we need to know if that post exists or not and we don't want to check the status of the response object.



1. `touch common/not-found-error.ts`

	```
	import { AppError } from './app-error';
	
	export class NotFoundError extends AppError {}
	```

2. `/data.service.ts`

```
    public getll(): Observable<object> {
        return this.http.get(this.url).pipe(catchError((error: Response) => {
            if (error.status === 404) {
                return throwError(new NotFoundError())
            } else {
              return throwError(new AppError(error))
            }
        }))
    }
```

### Global Error Handling

Now here we are dealing with only one component but in a real world application we're going to have tens or maybe hundreds of components.
We don't want to repeat this `if/else` statement lines in every component.


1. `touch common/app-error-handler`
2.  Add:

	```
	import { ErrorHandler } from '@angular/core';
		
	export class AppErrorHandler implements ErrorHandler {
	  handleError(error) {
	   	 alert('An unxpected error occured!');
	  }
	}
	```
	
	now instead of this alert we want to display a toast notification and that's where things are going to be a little bit more complex.
	Providers are faster than `ErrorHandler` so injecting the `ToastrService` in a convennctional way is not possible. To solve the async issue we use `NgZone` and the `Injector` to inject the `ToastrService`:
	
	```
	import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
	import { ToastrService } from "ngx-toastr";
	
	@Injectable()
	export class AppErrorHandler implements ErrorHandler {
	    constructor(private zone: NgZone, private injector: Injector) {}
	    public handleError(error: any): void {
	        this.zone.run(() => {
	            const toastr: ToastrService = this.injector.get(ToastrService);
	        });
	    }
	}
	
	```

3. So now we have a global error handler. Next we need to register this as a dependency or as a *provider* in the `/app.module.`  
In the provider's array we need to register this new class but we're going to use a different approach 

	>We want to tell Angular that wherever internally you're using error handler instead use `AppErrorHandler `.
	
	```
	providers: [
	PostsService,
	{ provide: ErrorHandler, useClass: AppErrorHandler}
	],
	```

4. Back to the `DataService`

	```
	    public getAll(): Observable<any> {
	        return this.http
	            .get({this.url})
	            .pipe(catchError(this.handleError));
	    }
	
	    private handleError(error: Response) {
	        if (error.status === 404) return throwError(new NotFoundError(error));
	        return throwError(new AppError(error));
	    }
	```

5. Finally in our `CitiesComponent`

```
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
```

## Reusable components & Bootstrap

In order to provide **responsiveness** to out UI I've installed Bootstrap (the grid system is one of the best IMO).

![snack screenshot](https://www.dropbox.com/s/mlpussj95pmrg0h/touchnote.png?raw=1)

### Cards

Bootstrap is an amazing css framework and comes with a set of pre-built components.
For this task I picked the famous *cards* and by combining it with `ngContent`, I have created a fully resusable card component that can be reused in every webApp:

```
<div class="card">
    <div class="card-header">
        <ng-content select=".header"></ng-content>
    </div>
    <div class="card-body">
        <ng-content select=".body"></ng-content>
    </div>
</div>
```

The `class` names in the parent component match the `select` in the card component. that's how we can inject our mark-up.

> **N.B.** to see the `bootstrap-spinnner` component you might want to simulate a Slow 3G connectio. Also check the css fot this component. You can change spinner's color by passing a different class.

## Final comments

### What went well?

- I really enjoyed the test;
- The global error handler is amazing;
- I am pretty happy with the layout and responsiveness;
- I wrote a kickass README :)

### What went badly?

- Implemeting a **proper** global error handler took was tough. It took me a lot to realise I had to use `ngZone` to handle the async issues.

### What could be improved?

- I have alredy implemeted the logic to fetch the forecast day/hour for a city onclick(). Cards could expand onclick and display the forecast by hour.
- Replacing the API's icons. They are just baaaad!
- Add backgorund-colour to cards to match the current weather.
- Write more unit tests.