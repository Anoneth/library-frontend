import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  mode: string,
  user: {
    userID: number,
    userName: string,
    userPassport: number,
    userDate: string
    userAddress: string
  }
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  userReactiveForm: FormGroup

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.initForm()
  }

  initForm() {
    this.userReactiveForm = this.formBuilder.group({
      userName: [
        this.data.user? this.data.user.userName : '',
        Validators.required
      ],
      userPassport: [
        this.data.user? this.data.user.userName : '',
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required
      ],
      userDate: [
        this.data.user? this.data.user.userDate : '',
        Validators.required
      ],
      userAddress: [
        this.data.user? this.data.user.userAddress: ''
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.userReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let userName = this.userReactiveForm.controls['userName']
    let userPassport = this.userReactiveForm.controls['userPassport']
    let userDate = this.userReactiveForm.controls['userDate']
    let userAddress = this.userReactiveForm.controls['userAddress']

    let isOk = true
    if (userName.invalid) {
      userName.markAsTouched()
      isOk = false
    }
    if (userName.invalid) {
      userName.markAsTouched()
      isOk = false
    }
    if (userPassport.invalid) {
      userPassport.markAsTouched()
      isOk = false
    }
    if (userDate.invalid) {
      userDate.markAsTouched()
      isOk = false
    }if (userAddress.invalid) {
      userAddress.markAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      userID: this.data.user? this.data.user.userID : -1,
      userName: userName.value,
      userPassport: userPassport.value,
      userDate: userDate.value,
      userAddress: userAddress.value
    })
  }

}
