import { TestBed } from '@angular/core/testing';

import { AjaxInterceptor } from './ajax.interceptor';

describe('AjaxInterceptorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AjaxInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: AjaxInterceptor = TestBed.inject(AjaxInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
