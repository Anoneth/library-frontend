import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  body = ""
  constructor(app: AppService) {
    app.loadAuthors().subscribe(response => {
      this.body = response
    })
  }

}
