
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { map } from 'rxjs/operators'


export class StoreService<T> {
  private state$: BehaviorSubject<T>

  protected constructor(initial: T) {
    this.state$ = new BehaviorSubject<T>(initial)
  }

  protected get current(): T {
    return this.state$.getValue()
  }

  protected select<K>(mapper: (state: T) => K): Observable<K> {
    return this.state$.asObservable()
      .pipe(map(mapper), distinctUntilChanged())
  }

  protected mutate(newState: Partial<T>) {
    this.state$.next({
      ...this.current,
      ...newState
    })
  }
}
