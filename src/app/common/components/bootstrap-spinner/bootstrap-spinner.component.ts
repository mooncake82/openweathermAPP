import { Component, OnChanges, SimpleChanges, Input } from "@angular/core";

@Component({
    selector: "bootstrap-spinner",
    templateUrl: "./bootstrap-spinner.component.html",
    styleUrls: ["./bootstrap-spinner.component.scss"],
})
export class BootstrapSpinnerComponent implements OnChanges {
    @Input() isLoading: boolean;
    @Input() className: string;
    constructor() {}

    public ngOnChanges(change: SimpleChanges): void {
        if (change.isLoading.firstChange) {
            this.className = change.className.currentValue;
        }
    }
}
