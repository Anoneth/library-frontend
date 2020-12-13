import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements AfterViewInit {

  content: Author[] = []
  columns = ['authorName', 'authorBDate', 'bookCount', 'action']

  dataSource: MatTableDataSource<Author>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog, private auth: AuthService) { }

  ngAfterViewInit(): void {
    this.update()
  }

  canDelete(item): boolean {
    return !item.bookCount && this.auth.canDelete()
  }


  update() {
    this.network.get('/authors').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as Author[])
      this.dataSource.sort = this.sort
    },
      error => {
        console.log(error)
        this.dialog.open(ErrorDialogComponent, {
          restoreFocus: false,
          data: {
            msg: "Server error. Try again later."
          }
        })
      })
  }

  create() {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Create',
        author: null
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/authors", result).subscribe(response => {
          this.update()
        }, err => {
          this.dialog.open(ErrorDialogComponent, {
            restoreFocus: false,
            data: {
              msg: "Server error, changes doesn't save. Try again later."
            }
          })
          console.log(err)
        })
      }
    })
  }

  onEditClick(item: any) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Edit',
        author: item
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/authors", result).subscribe(response => {
          this.update()
        }, err => {
          console.log(err)
          this.dialog.open(ErrorDialogComponent, {
            restoreFocus: false,
            data: {
              msg: "Server error, changes doesn't save. Try again later."
            }
          })
        })
      }
    })
  }

  onDeleteClick(id: number) {
    this.network.delete('/authors/' + id).subscribe(response => {
      this.update()
    }, err => {
      console.log(err)
      this.dialog.open(ErrorDialogComponent, {
        restoreFocus: false,
        data: {
          msg: "Server error, changes doesn't save. Try again later."
        }
      })
    })
  }
}

export interface Author {
  authorID: number
  authorName: string
  authorBDate: string
  bookCount: number
}
