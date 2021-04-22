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

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Start Http");
    this.ajaxStatusChanged$.emit(true);
    const response = next.handle(request);
    return response.pipe(
      tap(next => { console.log("Event Http"); },
        error => {
          console.log("Error Http");
          this.ajaxStatusChanged$.emit(false);
        },
        () => {
          console.log("End Http");
          this.ajaxStatusChanged$.emit(false);
        }
      )
    );
  }
}
