import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonFormat',
})
export class JsonFormatPipe implements PipeTransform {
  transform(value?: string, ...args: unknown[]): string {
    return value ? JSON.stringify(JSON.parse(value), undefined, 3) : '';
  }
}
