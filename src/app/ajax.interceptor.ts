import { EventEmitter, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

  public ajaxStatusChanged$: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
  counter = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.counter++
    this.ajaxStatusChanged$.emit(true);
    const response = next.handle(request);
    return response.pipe(
      tap({
        next: event => {
        },
        error: errorResponse => {
          alert(errorResponse.error?.message || errorResponse.message);
          this.counter--
          this.ajaxStatusChanged$.emit(this.counter > 0);
        },
        complete: () => {
          this.counter--
          this.ajaxStatusChanged$.emit(this.counter > 0);
        }
      })
    );
  }
}
