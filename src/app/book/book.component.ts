import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Author } from '../author/author.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements AfterViewInit {

  columns = ['bookName', 'bookGenre', 'bookAuthors', 'action']

  genres: any

  authors: Author[]

  dataSource: MatTableDataSource<Book>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.update()
  }


  update() {
    this.network.get('/books/authors').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as Book[])
      this.dataSource.sort = this.sort
      this.genres = Array.from(new Set((response as Book[]).map(item => item.bookGenre)))
      this.network.get('/authors').toPromise().then(response => {
        this.authors = response as Author[]
      })
    },
      error => {
        console.log(error)
        this.dialog.open(ErrorDialogComponent), {
          restoreFocus: false,
          data: {
            msg: "Server error. Try again later."
          }
        }
      })
  }

  getAuthors(id: number[]) {
    if (id && id.length > 0 && this.authors) {
      let res = ""
      if (id.length > 1) {
        res = this.authors.find(item => item.authorID = id[0]).authorName
      }
      for (let i = 1; i < id.length; i++) {
        res += ', ' + this.authors.find(item => item.authorID = id[i]).authorName
      }
      return res
    }
    return "Empty"
  }

  create() {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '600px',
      restoreFocus: false,
      data: {
        mode: 'Create',
        book: null,
        genres: this.genres
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/books", result.book).subscribe(response => {
          this.update()
        }, err => {
          console.log(err)
          this.dialog.open(ErrorDialogComponent), {
            restoreFocus: false,
            data: {
              msg: "Server error, changes doesn't save. Try again later."
            }
          }
        })
      }
    })
  }

  onEditClick(item: any) {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Edit',
        book: item,
        genres: this.genres
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/books", result.book).subscribe(response => {
          this.update()
          console.log(response)
        }, err => {
          console.log(err)
          this.dialog.open(ErrorDialogComponent), {
            restoreFocus: false,
            data: {
              msg: "Server error, changes doesn't save. Try again later."
            }
          }
        })
      }
    })
  }

  onDeleteClick(id: number) {
    console.log(id)
    this.network.delete('/books/' + id).subscribe(response => {
      this.update()
      console.log(response)
    }, err => {
      console.log(err)
      this.dialog.open(ErrorDialogComponent), {
        restoreFocus: false,
        data: {
          msg: "Server error, changes doesn't save. Try again later."
        }
      }
    })
  }
}

export interface Book {
  bookID: number
  bookName: string
  bookGenre: number
  bookAuthors: number[]
}
