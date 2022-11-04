import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'
import { AppStateService, State } from './services/app-state.service';


export interface Data {
  header: string[]
  rows: any[][]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data$: Observable<Data> = new Observable()
  current$: Observable<{state: State, previous: State}> = new Observable()

  constructor(
    protected appStore: AppStateService
  ) {}

  ngOnInit(): void {
    this.current$ = this.appStore.selectAll()


    this.data$ = new Observable<Data>((subscriber) => {
      subscriber.next({
        header: ['a','b','c'],
        rows: [['1','2','3'],['2','3','1'],['3','1','2']]
      })
    })
    setTimeout(() => this.appStore.loaded(), 5000)
  }

  onEdit() {
    this.appStore.edit_clicked('1')
  }

  onClose() {
    this.appStore.click_closed()
  }

  onSubmit() {
    this.appStore.submit(new Observable<string>((subscriber) => {
      setTimeout(() => subscriber.next(Math.random() > 0.4 ? 'success' : 'fail'), 1000)
    }))
  }

  title = 'ustitch-manager';  
}
