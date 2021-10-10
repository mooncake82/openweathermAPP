import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        redirectTo: "cities",
        pathMatch: "full",
    },
    {
        path: "cities",
        loadChildren: () =>
            import("./views/cities/cities.module").then((m) => m.CitiesModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
