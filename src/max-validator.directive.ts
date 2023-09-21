import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appMaxValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true },
  ],
})
export class MaxValidatorDirective implements Validator {
  @Input()
  appMaxValidator!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return (control.value as number) > this.appMaxValidator
      ? { appMaxValidator: true }
      : null;
  }
}
