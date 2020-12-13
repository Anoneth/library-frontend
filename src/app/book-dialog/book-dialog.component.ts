import { ENTER, COMMA } from '@angular/cdk/keycodes'
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Author } from '../author/author.component';
import { NetworkService } from '../network.service';

export interface DialogData {
  mode: string,
  book: {
    bookID: number,
    bookName: string,
    bookGenre: string,
    bookAuthors: number[]
  },
  genres: any
}

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css']
})
export class BookDialogComponent implements OnInit {

  bookReactiveForm: FormGroup

  genres: string[]
  authors: Author[]
  selectedAuthors: Author[] = []
  separatorKeyCodes: number[] = [ENTER, COMMA]

  authorCtrl = new FormControl()

  filteredGenres: Observable<string[]>
  filteredAuthors: Observable<Author[]>

  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>

  constructor(public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private network: NetworkService) { }

  ngOnInit() {
    this.initForm()
    this.filteredGenres = this.bookReactiveForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGenre(value.bookGenre || ''))
      )

    this.network.get('/authors').subscribe(response => {
      this.authors = response as Author[]
      if (this.data.book && this.data.book.bookAuthors) {
        this.data.book.bookAuthors.forEach(item => {
          this.selectedAuthors.push(this.authors.find(x => x.authorID == item))
        })
      }
      this.filteredAuthors = this.bookReactiveForm.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAuthor(value.bookAuthors || ''))
      )
    }, err => {
      console.log(err)
    })
  }

  private _filterGenre(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.genres.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterAuthor(value: any): Author[] {
    if (typeof value != 'string') {
      value = ''
    }
    const filterValue = value.toLowerCase();
    return this.authors.filter(option => !(this.selectedAuthors.includes(option)) && option.authorName.toLowerCase().includes(filterValue))
  }

  initForm() {
    this.genres = this.data.genres
    this.bookReactiveForm = this.formBuilder.group({
      bookName: [
        this.data.book ? this.data.book.bookName : '',
        Validators.required
      ],
      bookGenre: [
        this.data.book ? this.data.book.bookGenre : '',
        Validators.required
      ],
      bookAuthors: [
        this.data.book && this.data.book.bookAuthors ? this.data.book.bookAuthors : [],
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.bookReactiveForm.controls[controlName]
    if (controlName == 'bookAuthors' && control.touched && this.selectedAuthors.length == 0) return true
    return control.invalid && (control.touched || control.dirty)
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  onAcceptClick() {
    let bookName = this.bookReactiveForm.controls['bookName']
    let bookGenre = this.bookReactiveForm.controls['bookGenre']
    let bookAuthors = this.bookReactiveForm.controls['bookAuthors']

    let isOk = true
    if (bookName.invalid) {
      bookName.markAsTouched()
      isOk = false
    }
    if (bookGenre.invalid) {
      bookGenre.markAsTouched()
      isOk = false
    }
    if (this.selectedAuthors.length == 0) {
      isOk = false
    }
    if (!isOk) return

    this.dialogRef.close({
      book: {
        bookID: this.data.book ? this.data.book.bookID : -1,
        bookName: bookName.value,
        bookGenre: bookGenre.value,
        bookAuthors: this.selectedAuthors.map(item => item.authorID)
      }
    })
  }

  remove(author: Author) {
    const ind = this.selectedAuthors.indexOf(author)
    if (ind >= 0) {
      this.selectedAuthors.splice(ind, 1)
      this.bookReactiveForm.updateValueAndValidity()
    }
  }

  add(event: MatChipInputEvent) {
    const input = event.input
    const value = event.value

    let found = this.authors.find(x => x.authorName == (value || '').trim())
    if (found) {
      this.selectedAuthors.push(found)
      if (input) {
        input.value = ''
      }
      this.authorCtrl.setValue(null)
      this.bookReactiveForm.updateValueAndValidity()
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.selectedAuthors.push(this.authors.find(x => x.authorName == event.option.viewValue))
    this.authorInput.nativeElement.value = ''
    this.authorCtrl.setValue(null)
    this.bookReactiveForm.updateValueAndValidity()
  }
}
