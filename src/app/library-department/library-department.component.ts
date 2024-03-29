import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { LibraryDepartmentDialogComponent } from '../library-department-dialog/library-department-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-lib-dep',
  templateUrl: './library-department.component.html',
  styleUrls: ['./library-department.component.css']
})
export class LibraryDepartmentComponent implements AfterViewInit {

  content: LibraryDepartment[] = []
  columns = ['departName', 'count', 'action']

  dataSource: MatTableDataSource<LibraryDepartment>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog, private auth:AuthService) { }

  ngAfterViewInit(): void {
    this.update()
  }

  canDelete(item): boolean {
    return !item.count && this.auth.canDelete()
  }


  update() {
    this.network.get('/lib-deps').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as LibraryDepartment[])
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
    const dialogRef = this.dialog.open(LibraryDepartmentDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Create',
        depart: null
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/lib-deps", result).subscribe(response => {
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
    const dialogRef = this.dialog.open(LibraryDepartmentDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Edit',
        depart: item
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/lib-deps", result).subscribe(response => {
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
    this.network.delete('/lib-deps/' + id).subscribe(response => {
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

export interface LibraryDepartment {
  departCode: number
  departName: string
  count: number
}
