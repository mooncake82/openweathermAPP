import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "removeDecimals",
})
export class RemoveDecimalPipe implements PipeTransform {
    transform(value: number, ...args: any[]): any {
        return Math.floor(value);
    }
}
