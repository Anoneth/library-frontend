import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from '../network.service';
import { MatDialog } from '@angular/material/dialog'
import { PublishingHouseDialogComponent } from '../publishing-house-dialog/publishing-house-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-ph',
  templateUrl: './publishing-house.component.html',
  styleUrls: ['./publishing-house.component.css']
})
export class PublishingHouseComponent implements AfterViewInit {

  content: PublishingHouse[] = []
  columns = ['phName', 'phAddress', 'count', 'action']

  dataSource: MatTableDataSource<PublishingHouse>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private network: NetworkService, private dialog: MatDialog, private auth:AuthService) { }

  ngAfterViewInit(): void {
    this.update()
  }

  canDelete(item): boolean {
    return !item.count && this.auth.canDelete()
  }


  update() {
    this.network.get('/pub-houses').toPromise().then(response => {
      this.dataSource = new MatTableDataSource(response as PublishingHouse[])
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
    const dialogRef = this.dialog.open(PublishingHouseDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Create',
        ph: null
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.put("/pub-houses", result).subscribe(response => {
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
    const dialogRef = this.dialog.open(PublishingHouseDialogComponent, {
      restoreFocus: false,
      data: {
        mode: 'Edit',
        ph: item
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.network.post("/pub-houses", result).subscribe(response => {
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
    this.network.delete('/pub-houses/' + id).subscribe(response => {
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

export interface PublishingHouse {
  phID: number
  phName: string
  phAddress: string
  count: number
}
