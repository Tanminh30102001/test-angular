import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-dialog-common',
  imports: [MatFormFieldModule,MatInputModule,ReactiveFormsModule,MatDialogModule,CommonModule,MatIconModule,MatDividerModule],
  templateUrl: './dialog-common.component.html',
  styleUrl: './dialog-common.component.css',
  standalone:true
})
export class DialogCommonComponent {
  form: FormGroup; // FormGroup để quản lý form
  type: string;
  title: string;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCommonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Nhận dữ liệu từ component cha
  ) {
    this.form = this.fb.group({
      ATMName: [data?.initialData?.ATMName || '', Validators.required],
      Manufacturer: [data?.initialData?.Manufacturer || '', Validators.required],
      type: [data?.initialData?.type || '', Validators.required],
      SerialNumber: [data?.initialData?.SerialNumber || '', Validators.required],
      image: [data?.initialData?.image || '']
    });
    this.type = data.type;
    this.title = data.title;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  handleDelete(): void {
    if (this.data?.onSubmit) {
      this.data.onSubmit(); 
    }
    this.dialogRef.close();
  }
  handleSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.data?.onSubmit) {
        this.data.onSubmit(formData);
      }
      this.dialogRef.close();
    } else {
      console.log('Form is invalid');
    }
  }
}
