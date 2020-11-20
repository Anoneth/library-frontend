import { Component } from '@angular/core';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  title = 'Demo';
  greeting: any = {};

  constructor() {
    //http.get('http://localhost:8080/authors').subscribe(data => this.greeting = data);
  }

  authenticated() { return false}

}