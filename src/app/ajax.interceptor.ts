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

  public ajaxStatusChanged$: EventEmitter<Boolean> = new EventEmitter();
  constructor() {}
  counter = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Start Http");
    this.counter++
    this.ajaxStatusChanged$.emit(true);
    const response = next.handle(request);
    return response.pipe(
      tap({
        next: event => {
        },
        error: error => {
          alert(error.message)
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
