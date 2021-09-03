import { EventEmitter, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

  public ajaxStatusChanged$: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
  counter = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const hideLoader = (request.params.get('fromMintid') || 0) < 0;

    if (!hideLoader) {
      this.counter++
      this.ajaxStatusChanged$.emit(true);
    }
    const response = next.handle(request);
    return response.pipe(
      tap({
        next: event => {
        },
        error: errorResponse => {
          alert(errorResponse.error?.message || errorResponse.message);
          if (!hideLoader) {
            this.ajaxStatusChanged$.emit(this.counter > 0);
          }
        },
        complete: () => {
          if (!hideLoader) {
            this.ajaxStatusChanged$.emit(this.counter > 0);
          }
        }
      }),
      finalize(() => {
        if (!hideLoader) {
          this.counter--
          this.ajaxStatusChanged$.emit(this.counter > 0);
        }
      })
    );
  }
}
