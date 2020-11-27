import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit {

  content: User[] = []
  columns = ['userName', 'userPassport', 'userDate', 'userAddress', 'bookCount', 'action']

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.update()
  }


  update() {
    this.network.get('/users').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as User[])
      this.dataSource.sort = this.sort
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

  create() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Create',
        user: null
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/users", result).subscribe(response => {
          this.update(); console.log(response)
        }, err => {
          this.dialog.open(ErrorDialogComponent), {
            restoreFocus: false,
            data: {
              msg: "Server error, changes doesn't save. Try again later."
            }
          }
          console.log(err)
        })
      }
    })
  }

  onEditClick(item: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Edit',
        user: item
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/users", result).subscribe(response => {
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

  onDeleteClick(id: number) {
    console.log(id)
    this.network.delete('/users/' + id).subscribe(response => {
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

export interface User {
  userID: number
  userName: string
  userPassport: number
  userDate: string
  userAddress: string
  bookCount: number
}
