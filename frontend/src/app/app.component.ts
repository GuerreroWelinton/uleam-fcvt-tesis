import {
  CommonModule,
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { PeriodService } from './core/services/period.service';
import { AppState } from './core/store';
import { UserActions } from './core/store/user/user.actions';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CustomizerSettingsComponent } from './shared/components/customizer-settings/customizer-settings.component';
import { CustomizerSettingsService } from './shared/components/customizer-settings/customizer-settings.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ToggleService } from './shared/components/sidebar/toggle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    CustomizerSettingsComponent,
    FooterComponent,
    HeaderComponent,
    RouterLink,
    RouterOutlet,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
})
export class AppComponent {
  private routerSubscription: any;
  private location: any;

  public isSidebarToggled$ = this._toggleService.isSidebarToggled$;

  constructor(
    public router: Router,
    public themeService: CustomizerSettingsService,
    private _store: Store<AppState>,
    private _toggleService: ToggleService,
    private _periodService: PeriodService
  ) {}

  ngOnInit() {
    this.recallJsFuntions();
    this._store.dispatch(UserActions.preAuth());
    // this.fetchPeriods();
  }

  private fetchPeriods(): void {
    this._periodService.getPeriods().subscribe({
      next: (res) =>
        this._periodService.selectLatestPeriod(res.data?.result || []),
    });
  }

  private recallJsFuntions() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel
        )
      )
      .subscribe((event) => {
        this.location = this.router.url;
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
  }
}
