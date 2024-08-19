import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppState } from '../../core/store';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../core/store/user/user.selectors';
import { IUser } from '../users/interfaces/user.interface';
import { USER_ROLES } from '../../core/enums/general.enum';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [MatCardModule, CommonModule, SafePipe],
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss'],
})
export default class TutorialsComponent implements OnInit {
  public user: IUser | null = null;

  // Arrays para cada rol
  public teacherVideos: { title: string; url: string; role: string }[] = [];
  public supervisorVideos: { title: string; url: string; role: string }[] = [];
  public adminVideos: { title: string; url: string; role: string }[] = [];

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this._store.select(selectAuthUser).subscribe({
      next: (user) => {
        if (!user) {
          return;
        }
        this.user = user;
        this.setVideosForRole(user.roles);
      },
    });
  }

  private setVideosForRole(roles: string[]): void {
    // Limpia los arrays antes de agregar los videos
    this.teacherVideos = [];
    this.supervisorVideos = [];
    this.adminVideos = [];

    if (roles.includes(USER_ROLES.TEACHER)) {
      this.teacherVideos.push({
        title: 'Reservar espacio Educativo',
        url: 'https://www.youtube.com/embed/TuxT9Bdo4JE',
        role: USER_ROLES.TEACHER,
      });
    }
    if (roles.includes(USER_ROLES.SUPERVISOR)) {
      this.supervisorVideos.push(
        {
          title: 'Gestión de usuarios',
          url: 'https://www.youtube.com/embed/1trXC3kIMFU',
          role: USER_ROLES.SUPERVISOR,
        },
        {
          title: 'Gestión de Mis Espacios Educativos',
          url: 'https://www.youtube.com/embed/rBdMSmX6ufM',
          role: USER_ROLES.SUPERVISOR,
        }
      );
    }
    if (roles.includes(USER_ROLES.ADMIN)) {
      this.adminVideos.push(
        {
          title: 'Vista general',
          url: 'https://www.youtube.com/embed/NIZisQpgWZQ',
          role: USER_ROLES.ADMIN,
        },
        {
          title: 'Periodos, Carreras y Asignaturas',
          url: 'https://www.youtube.com/embed/qsoP6RqHV-A',
          role: USER_ROLES.ADMIN,
        },
        {
          title: 'Gestión de usuarios',
          url: 'https://www.youtube.com/embed/1trXC3kIMFU',
          role: USER_ROLES.ADMIN,
        },
        {
          title: 'Edificios y Espacios educativos',
          url: 'https://www.youtube.com/embed/lWXAxS3gdpA',
          role: USER_ROLES.ADMIN,
        }
      );
    }
  }
}
