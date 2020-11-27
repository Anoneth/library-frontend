import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  mode: string,
  ph: {
    phID: number,
    phName: string,
    phAddress: string
  }
}

@Component({
  selector: 'app-ph-dialog',
  templateUrl: './publishing-house-dialog.component.html',
  styleUrls: ['./publishing-house-dialog.component.css']
})
export class PublishingHouseDialogComponent implements OnInit {

  phReactiveForm: FormGroup

  constructor(public dialogRef: MatDialogRef<PublishingHouseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.initForm()
  }

  initForm() {
    this.phReactiveForm = this.formBuilder.group({
      phName: [
        this.data.ph? this.data.ph.phName : '',
        Validators.required
      ],
      phAddress: [
        this.data.ph? this.data.ph.phAddress : '',
        Validators.required
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.phReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let phName = this.phReactiveForm.controls['phName']
    let phAddress = this.phReactiveForm.controls['phAddress']

    let isOk = true
    if (phName.invalid) {
      phName.markAsTouched()
      isOk = false
    }
    if (phAddress.invalid) {
      phAddress.markAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      phID: this.data.ph? this.data.ph.phID : -1,
      phName: phName.value,
      phAddress: phAddress.value
    })
  }

}
