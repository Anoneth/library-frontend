import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { PublishingHouse } from '../publishing-house/publishing-house.component';
import { Book } from '../book/book.component';

@Component({
  selector: 'app-book',
  templateUrl: './book-edition.component.html',
  styleUrls: ['./book-edition.component.css']
})
export class BookEditionComponent implements AfterViewInit {

  columns = ['ISBN', 'bookName', 'bookAuthors', 'phName', 'beYear', 'cotbCount', 'action']

  pHouses: PublishingHouse[]

  books: Book[]

  unique: string[]

  dataSource: MatTableDataSource<BookEdition>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.update()
  }


  update() {
    this.network.get('/book-editions/authors').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as BookEdition[])
      this.dataSource.sort = this.sort
      this.unique = Array.from(new Set((response as BookEdition[]).map(item => item.ISBN)))
      this.network.get('/pub-houses').toPromise().then(response => {
        this.pHouses = response as PublishingHouse[]
      })
      this.network.get('/books').toPromise().then(response => {
        this.books = response as Book[]
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
    if (id && id.length > 0 && this.books) {
      let res = ""
      if (id.length > 1) {
        res = this.books.find(item => item.bookID = id[0]).bookName
      }
      for (let i = 1; i < id.length; i++) {
        res += ', ' + this.books.find(item => item.bookID = id[i]).bookName
      }
      return res
    }
    return "Empty"
  }

  getPHName(id: number) {
    return (id && this.pHouses && this.pHouses.find(item => item.phID == id)) ? this.pHouses.find(item => item.phID == id).phName : 'Empty'
  }

  create() {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '600px',
      restoreFocus: false,
      data: {
        mode: 'Create',
        bookEdition: null,
        books: this.books,
        pHouses: this.pHouses
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/book-editions", result.book).subscribe(response => {
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
        bookEdition: item,
        books: this.books,
        pHouses: this.pHouses
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
    this.network.delete('/book-editions/' + id).subscribe(response => {
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

export interface BookEdition {
  ISBN: string
  bookName: string
  bookAuthors: string
  phName: string
  beYear: number
  cotbCount: number
}
