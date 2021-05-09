import { AjaxInterceptor } from './ajax.interceptor';
import { Component } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'cardano-tools-frontend';
  ajaxStatus: boolean = false;

  constructor(private ajaxInterceptor: AjaxInterceptor, private location: Location, private dialogRef: MatDialog) {
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.ajaxStatus = ajaxStatus);

    // push history state when a dialog is opened
    dialogRef.afterOpened.subscribe((ref: MatDialogRef<any, any>) => {

      // when opening a dialog, push a new history entry with the dialog id
      location.go('', '', ref.id);

      ref.afterClosed().subscribe(() => {
        // when closing but the dialog is still the current state (because it has not been closed via the back button), pop a history entry
        if (location.getState() === ref.id) {
          history.go(-1);
        }
      });

    });

    location.subscribe((event: PopStateEvent) => {
      const frontDialog = dialogRef.openDialogs[dialogRef.openDialogs.length - 1];
      // when the user hits back, the state wont equal the front popup anymore, so close it
      // when a popup was closed manually, the state should match the underlying popup, and we wont close the current front
      if (frontDialog && location.getState() !== frontDialog.id) {
        frontDialog.close();
      }
    });
  }

}
