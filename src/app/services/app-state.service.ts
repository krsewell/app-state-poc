import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from './store-service.service';

export enum State {
  LOADING,
  DONE,
  MODAL_OPEN,
  SUBMITTED
}

export interface AppState {
  state: State,
  previous: State
}


@Injectable({
  providedIn: 'root'
})
export class AppStateService extends StoreService<AppState> {
  
  constructor() {
    super({state: State.LOADING, previous: State.LOADING})
  }

  loaded() {
    if (this.current.state === State.LOADING) {
      this.mutate({state: State.DONE})
    }
  }

  edit_clicked(id: string) {
    if (this.current.state === State.DONE) {
      this.mutate({state: State.MODAL_OPEN, previous: State.DONE})
    }
  }

  click_closed() {
    if (this.current.state === State.MODAL_OPEN) {
      this.mutate({state: State.DONE, previous: State.MODAL_OPEN})
    }
  }

  submit(response: Observable<string>) {
    if (this.current.state === State.MODAL_OPEN) {
      this.mutate({state: State.SUBMITTED, previous: State.MODAL_OPEN})
      response.subscribe(next => {
        if (next === 'success') {
          this.transmit_success()
        } else {
          this.transmit_failure()
        }
      })
    }
  }

  private transmit_failure() {
    if (this.current.state === State.SUBMITTED) {
      this.mutate({state: State.MODAL_OPEN, previous: State.SUBMITTED})
    }
  }

  private transmit_success() {
    if (this.current.state === State.SUBMITTED) {
      this.mutate({state: State.DONE, previous: State.SUBMITTED})
    }
  }

  selectAll(): Observable<{state: State, previous: State}> {
    return this.select<{state: State, previous: State}>(s => s)
  }

  get state() {
    return State[this.current.state]
  }

  get previous() {
    return State[this.current.previous]
  }
}
