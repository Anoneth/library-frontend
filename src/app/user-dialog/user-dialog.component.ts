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
  },
  unique: string[]
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  userReactiveForm: FormGroup

  unique: string[]

  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.userReactiveForm = this.formBuilder.group({
      userName: [
        this.data.user? this.data.user.userName : '',
        Validators.required
      ],
      userPassport: [
        this.data.user? this.data.user.userPassport : '',
        Validators.compose([Validators.min(1000000000), Validators.max(9999999999), Validators.required])
      ],
      userDate: [
        this.data.user? this.data.user.userDate : '',
        Validators.required
      ],
      userAddress: [
        this.data.user? this.data.user.userAddress: ''
      ]
    })
    this.unique = this.data.unique
  }

  controlIsInvalid(controlName: string) {
    let control = this.userReactiveForm.controls[controlName]
    if (controlName == "userPassport" && this.unique && this.unique.includes(control.value.toString())) {
      if (this.data.user) {
        return this.data.user.userPassport != control.value
      } else {
        return true
      }
    }
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
