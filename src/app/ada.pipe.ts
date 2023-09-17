import { DecimalPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ada'
})
export class AdaPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string
  ) { }

  transform(value: number): string {
    let decimalPipe = new DecimalPipe(this.locale);
    return decimalPipe.transform(value / 1000000, '1.0-2') + '\xa0₳';
  }

}
