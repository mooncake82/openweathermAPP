import { NgModule } from "@angular/core";
import { RemoveDecimalPipe } from "./pipes/temp.pipe";
import { CommonModule } from "@angular/common";
import { BootstrapCardComponent } from "./components/bootstrap-card/bootstrap-card.component";
import { BootstrapSpinnerComponent } from "./components/bootstrap-spinner/bootstrap-spinner.component";

@NgModule({
    imports: [CommonModule],
    exports: [
        RemoveDecimalPipe,
        BootstrapCardComponent,
        BootstrapSpinnerComponent,
    ],
    declarations: [
        RemoveDecimalPipe,
        BootstrapCardComponent,
        BootstrapSpinnerComponent,
    ],
    providers: [],
})
export class SharedModule {}
