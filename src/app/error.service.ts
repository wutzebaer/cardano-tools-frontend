import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface WalletError {
  code: number;
  info: string;
}

export interface MessageError {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any) {
    console.error(error);

    let message;
    if (this.isCardanoDAppError(error)) {
      message = error.info;
    } else if (this.isMessageError(error)) {
      message = error.message;
    } else {
      message = JSON.stringify(error);
    }

    this.snackBar.open(message, 'close', {
      verticalPosition: 'top',
      duration: 1000 * 3,
    });
  }

  public isCardanoDAppError(error: any): error is WalletError {
    return (
      error && typeof error.code === 'number' && typeof error.info === 'string'
    );
  }
  public isMessageError(error: any): error is MessageError {
    return error && typeof error.message === 'string';
  }
}
