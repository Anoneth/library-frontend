import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  mode: string,
  author: {
    authorID: number,
    authorName: string,
    authorBDate: string
  }
}

@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.css']
})
export class AuthorDialogComponent implements OnInit {

  authorReactiveForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AuthorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.initForm()
  }

  initForm() {
    this.authorReactiveForm = this.formBuilder.group({
      authorName: [
        this.data.author? this.data.author.authorName : '',
        Validators.required
      ],
      authorBDate: [
        this.data.author? this.data.author.authorBDate : '',
        Validators.required
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.authorReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let authorName = this.authorReactiveForm.controls['authorName']
    let authorBDate = this.authorReactiveForm.controls['authorBDate']

    let isOk = true
    if (authorName.invalid) {
      authorName.markAsTouched()
      isOk = false
    }
    if (authorBDate.invalid) {
      authorBDate.markAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      authorID: this.data.author? this.data.author.authorID : -1,
      authorName: authorName.value,
      authorBDate: authorBDate.value
    })
  }

}
