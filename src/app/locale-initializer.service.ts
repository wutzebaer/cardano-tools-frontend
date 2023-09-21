import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocaleInitializerService {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  initialize(): Promise<void> {
    const localeId = this.locale.substring(0, 2);
    return import(
      /* webpackInclude: /(.*)\.js$/ */
      `@angular/common/locales/${localeId}.js`
    ).then((module) => {
      registerLocaleData(module.default);
      return Promise.resolve();
    });
  }
}
