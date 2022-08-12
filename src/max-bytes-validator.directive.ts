import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appMaxBytesValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxBytesValidatorDirective, multi: true }]
})
export class MaxBytesValidatorDirective implements Validator {

  @Input()
  appMaxBytesValidator!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(Buffer.from(control.value as string).length)
    return (Buffer.from(control.value as string).length > this.appMaxBytesValidator) ? { appMaxBytesValidator: true } : null;
  }

}
