import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slot'
})
export class SlotPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): Date {
    return new Date((1596491091 + (value - 4924800)) * 1000);
  }

}
