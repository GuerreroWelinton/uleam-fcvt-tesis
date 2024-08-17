// import { Component, OnInit } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';
// import { MatTableDataSource } from '@angular/material/table';
// import { map, Observable, of } from 'rxjs';
// import { OnBookingService } from '../../../../core/services/on-booking.service';

// @Component({
//   selector: 'app-section-top-users-bookings',
//   standalone: true,
//   imports: [MatCardModule],
//   templateUrl: './section-top-users-bookings.component.html',
//   styleUrls: ['./section-top-users-bookings.component.scss'],
// })
// export class SectionTopUsersBookingsComponent implements OnInit {
//   // TABLE
//   public isLoading: boolean = false;
//   public dataSource$: Observable<
//     MatTableDataSource<{
//       teacherName: string;
//       teacherId: string;
//       totalBookings: number;
//     }>
//   > = of(
//     new MatTableDataSource<{
//       teacherName: string;
//       teacherId: string;
//       totalBookings: number;
//     }>()
//   );

//   public displayedColumns = ['teacherName', 'teacherId', 'totalBookings'];

//   constructor(private _onBookingService: OnBookingService) {}

//   ngOnInit(): void {
//     this.fetchBookings();
//   }

//   private fetchBookings(): void {
//     this.dataSource$ = this._onBookingService
//       .list({ limit: 100, page: 1 })
//       .pipe(
//         map((res) => {
//           const bookings = res?.data?.result || [];
//           if (Array.isArray(bookings)) {
//             // Agrupa por profesor y cuenta las reservas
//             const teacherMap = new Map<
//               string,
//               { teacherName: string; teacherId: string; totalBookings: number }
//             >();

//             bookings.forEach((booking) => {
//               const teacherId = booking.teacher.identityDocument; // Asegúrate de que esto sea el ID correcto
//               const teacherName = booking.teacher.name; // Asegúrate de que esto sea el nombre correcto

//               if (teacherMap.has(teacherId)) {
//                 teacherMap.get(teacherId)!.totalBookings += 1;
//               } else {
//                 teacherMap.set(teacherId, {
//                   teacherName: teacherName || 'Desconocido',
//                   teacherId: teacherId,
//                   totalBookings: 1,
//                 });
//               }
//             });

//             // Convierte el mapa a un array
//             return new MatTableDataSource(Array.from(teacherMap.values()));
//           } else {
//             // Si result no es una lista, devuelve una lista vacía
//             return new MatTableDataSource([]);
//           }
//         })
//       );
//   }
// }
