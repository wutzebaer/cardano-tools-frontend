import { AjaxInterceptor } from './ajax.interceptor';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'cardano-tools-frontend';
  ajaxStatus: Boolean = false;

  constructor(private ajaxInterceptor: AjaxInterceptor) {
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.ajaxStatus = ajaxStatus);
  }

}
