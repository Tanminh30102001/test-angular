import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'Close', duration: number = 3000, type: string = 'info') {
    let panelClass: string;
    switch (type) {
      case 'error':
        panelClass = 'error-snackbar';
        break;
      case 'success':
        panelClass = 'success-snackbar';
        break;
      case 'info':
      default:
        panelClass = 'info-snackbar';
        break;
    }

    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [panelClass], 
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
