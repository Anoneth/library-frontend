import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../book/book.component';
import { PublishingHouse } from '../publishing-house/publishing-house.component';

export interface DialogData {
  mode: string,
  unique: string[]
  bookEdition: {
    beID: number
    isbn: string
    bookID: number
    phID: number
    beYear: number
    count: number
  },
  books: Book[],
  pHouses: PublishingHouse[]
}

@Component({
  selector: 'app-book-edition-dialog',
  templateUrl: './book-edition-dialog.component.html',
  styleUrls: ['./book-edition-dialog.component.css']
})
export class BookEditionDialogComponent implements OnInit {

  bookEditionReactiveForm: FormGroup

  unique: string[]
  books: Book[]
  pHouses: PublishingHouse[]
  

  bookEditionCtrl = new FormControl()

  @ViewChild('bookInput') authorInput: ElementRef<HTMLInputElement>

  constructor(public dialogRef: MatDialogRef<BookEditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder) {
      this.books = data.books
      this.pHouses = data.pHouses
    }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.unique = this.data.unique
    this.bookEditionReactiveForm = this.formBuilder.group({
      isbn: [
        this.data.bookEdition ? this.data.bookEdition.isbn : '',
        Validators.required
      ],
      bookID: [
        this.data.bookEdition && this.data.books ? this.books.find(item => item.bookID == this.data.bookEdition.bookID).bookID : null,
        Validators.required
      ],
      phID: [
        this.data.bookEdition && this.data.pHouses ? this.pHouses.find(item => item.phID == this.data.bookEdition.phID).phID : null,
        Validators.required
      ],
      beYear: [
        this.data.bookEdition ? this.data.bookEdition.beYear : '',
        Validators.compose([Validators.required, Validators.min(0), Validators.max(2030)])
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.bookEditionReactiveForm.controls[controlName]
    if (controlName == 'isbn' && this.unique && this.unique.includes(control.value)) return true
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let isbn = this.bookEditionReactiveForm.controls['isbn']
    let bookID = this.bookEditionReactiveForm.controls['bookID']
    let phID = this.bookEditionReactiveForm.controls['phID']
    let beYear = this.bookEditionReactiveForm.controls['beYear']

    let isOk = true
    if (this.unique.includes(isbn.value)) {
      isbn.setErrors({'notunique': true})
    }
    if (isbn.invalid) {
      isbn.markAsTouched()
      isOk = false
    }
    if (bookID.invalid) {
      bookID.markAsTouched()
      isOk = false
    }
    if (phID.invalid) {
      phID.markAsTouched()
      isOk = false
    }
    if (beYear.invalid) {
      beYear.markAllAsTouched()
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      bookEdition: {
        beID: this.data.bookEdition?.beID,
        isbn: isbn.value,
        bookID: bookID.value,
        phID: phID.value,
        beYear: beYear.value
      }
    })
  }
}
