import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appMinValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true },
  ],
})
export class MinValidatorDirective implements Validator {
  @Input()
  appMinValidator!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return (control.value as number) < this.appMinValidator
      ? { appMinValidator: true }
      : null;
  }
}
