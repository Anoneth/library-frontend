import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  mode: string,
  depart: {
    departID: number,
    departName: string,
    departBDate: string
  }
}

@Component({
  selector: 'app-lib-dep-dialog',
  templateUrl: './library-department-dialog.component.html',
  styleUrls: ['./library-department-dialog.component.css']
})
export class LibraryDepartmentDialogComponent implements OnInit {

  departReactiveForm: FormGroup

  constructor(public dialogRef: MatDialogRef<LibraryDepartmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.departReactiveForm = this.formBuilder.group({
      departName: [
        this.data.depart? this.data.depart.departName : '',
        Validators.required
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.departReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let departName = this.departReactiveForm.controls['departName']

    let isOk = true
    if (departName.invalid) {
      departName.markAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      departID: this.data.depart? this.data.depart.departID : -1,
      departName: departName.value
    })
  }

}
