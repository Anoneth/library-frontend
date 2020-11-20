import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../network.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  content: Author[] = []
  columns = ['Name', 'Day of Birth', 'Number of book']

  constructor(private network: NetworkService) { }

  ngOnInit(): void {
    this.network.get('/authors').toPromise().then(response => {
      this.content = response as Author[]
    })
  }
}

export interface Author {
  authorID: number
  authorName: string
  authorBDate: string
  bookCount: number
}
