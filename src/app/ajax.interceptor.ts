import { Injectable } from '@angular/core';
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

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Start Http");
    const response = next.handle(request);
    return response.pipe(
      tap(next => { console.log("Event Http"); },
        error => { console.log("Error Http"); },
        () => { console.log("End Http"); }
      )
    );
  }
}
