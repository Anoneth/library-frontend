import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { CopyOfTheBookDialogComponent } from '../copy-of-the-book-dialog/copy-of-the-book-dialog.component';
import { LibraryDepartment } from '../library-department/library-department.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-copy-of-the-book',
  templateUrl: './copy-of-the-book.component.html',
  styleUrls: ['./copy-of-the-book.component.css']
})
export class CopyOfTheBookComponent implements AfterViewInit {

  columns = ['inventoryNumber', 'isbn', 'departCode', 'userID', 'action']

  departs: LibraryDepartment[]

  dataSource: MatTableDataSource<CopyOfTheBook>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog, private auth:AuthService) { }

  ngAfterViewInit(): void {
    this.update()
  }

  canDelete(): boolean {
    return this.auth.canDelete()
  }


  update() {
    this.network.get('/cotbs').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as CopyOfTheBook[])
      this.dataSource.sort = this.sort
      this.network.get('/lib-deps').toPromise().then(response => {
        this.departs = response as LibraryDepartment[]
      })
    }, error => {
      console.log(error)
      this.dialog.open(ErrorDialogComponent, {
        restoreFocus: false,
        data: {
          msg: "Server error. Try again later."
        }
      })
    })
  }

  getDepartName(id: number) {
    if (this.departs && this.departs.find(item => item.departCode == id)) {
      return this.departs.find(item => item.departCode == id).departName
    }
    return "Empty"
  }

  getOnHands(userID) {
    return userID ? 'Yes' : 'No'
  }

  create() {
    const dialogRef = this.dialog.open(CopyOfTheBookDialogComponent, {
      width: '600px',
      restoreFocus: false,
      data: {
        mode: 'Create',
        cotb: null,
        departs: this.departs
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/cotbs", result.cotb).subscribe(response => {
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

  onEditClick(item: any) {
    const dialogRef = this.dialog.open(CopyOfTheBookDialogComponent, {
      width: '600px',
      restoreFocus: false,
      data: {
        mode: 'Create',
        cotb: item,
        departs: this.departs
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/cotbs", result.cotb).subscribe(response => {
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
    this.network.delete('/cotbs/' + id).subscribe(response => {
      this.update()
      console.log(response)
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

export interface CopyOfTheBook {
  beID: number
  isbn: string
  bookName: string
  phName: string
  beYear: number
  count: number
}
