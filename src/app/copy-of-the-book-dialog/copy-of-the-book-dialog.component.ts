import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BookEdition } from '../book-edition/book-edition.component';
import { Book } from '../book/book.component';
import { LibraryDepartment } from '../library-department/library-department.component';
import { NetworkService } from '../network.service';
import { PublishingHouse } from '../publishing-house/publishing-house.component';
import { User } from '../user/user.component';

export interface DialogData {
  mode: string,
  cotb: {
    inventoryNumber: number,
    isbn: string,
    departCode: number,
    userID: number
  },
  departs: LibraryDepartment[]
}

@Component({
  selector: 'app-copy-of-the-book-dialog',
  templateUrl: './copy-of-the-book-dialog.component.html',
  styleUrls: ['./copy-of-the-book-dialog.component.css']
})
export class CopyOfTheBookDialogComponent implements OnInit {

  copyOfTheBookEditionReactiveForm: FormGroup

  bes: BookEdition[]
  departs: LibraryDepartment[]
  users: User[]
  
  copyOfTheBookEditionCtrl = new FormControl()

  constructor(public dialogRef: MatDialogRef<CopyOfTheBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private network: NetworkService) {
      this.departs = data.departs
    }

  ngOnInit() {
    this.initForm()

    this.network.get('/users').subscribe(response => {
      this.users = response as User[]
      if (this.data.cotb && this.data.cotb.userID) {
        this.copyOfTheBookEditionReactiveForm.controls['userID'].setValue(this.users.find(item => item.userID == this.data.cotb.userID).userID)
      }
    }, err => {
      console.log(err)
    })
    this.network.get('/book-editions').subscribe(response => {
      this.bes = response as BookEdition[]
      if (this.data.cotb) {
        this.copyOfTheBookEditionReactiveForm.controls['isbn'].setValue(this.bes.find(item => item.isbn == this.data.cotb.isbn).isbn)
      }
    }, err => {
      console.log(err)
    })
  }

  initForm() {
    this.copyOfTheBookEditionReactiveForm = this.formBuilder.group({
      isbn: [
        '',
        Validators.required
      ],
      departCode: [
        this.data.cotb && this.data.departs ? this.data.departs.find(item => item.departCode == this.data.cotb.departCode).departCode : '',
        Validators.required
      ],
      userID: [
        ''
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.copyOfTheBookEditionReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let isbn = this.copyOfTheBookEditionReactiveForm.controls['isbn']
    let departCode = this.copyOfTheBookEditionReactiveForm.controls['departCode']
    let userID = this.copyOfTheBookEditionReactiveForm.controls['userID']

    let isOk = true
    if (isbn.invalid) {
      isbn.markAsTouched()
      isOk = false
    }
    if (departCode.invalid) {
      departCode.markAsTouched()
      isOk = false
    }
    if (userID.invalid) {
      userID.markAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      cotb: {
        inventoryNumber: this.data.cotb?.inventoryNumber,
        isbn: isbn.value,
        departCode: departCode.value,
        userID: userID.value != -1 ? userID.value : null
      }
    })
  }
}
