import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexToString',
})
export class HexToStringPipe implements PipeTransform {
  transform(value?: string, ...args: unknown[]): string {
    return value ? Buffer.from(value, 'hex').toString() : '';
  }
}
