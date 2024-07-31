import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupContainerService {
  private templateSubject =
    new BehaviorSubject<TemplateRef<HTMLElement> | null>(null);
  private tooglePopupSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  public showTemplate(template: TemplateRef<HTMLElement> | null): void {
    this.templateSubject.next(template);
  }

  public tooglePopup(classApplied: boolean): void {
    this.tooglePopupSubject.next(classApplied);
  }

  public getShowTemplate(): Observable<TemplateRef<HTMLElement> | null> {
    return this.templateSubject.asObservable();
  }

  public getTooglePopup(): Observable<boolean> {
    return this.tooglePopupSubject.asObservable();
  }
}
