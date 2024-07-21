import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
    providedIn: 'root',
})
export class TableFilterService {
    constructor() {}

    public applyFilter<T>(
        event: Event,
        dataSource: MatTableDataSource<T>
    ): void {
        const filterValue = (event.target as HTMLInputElement).value;

        //TODO Editar las interfaces ICareerSubjectTable para que el filtro busque bien ya
        //TODO que solo busca al primer nivel no dentro de los objetos

        console.log('🚀 ~ TableFilterService ~ dataSource:', dataSource);

        console.log(
            '🚀 ~ TableFilterService ~ filterValue:',
            filterValue.trim().toLowerCase()
        );

        dataSource.filter = filterValue.trim().toLowerCase();
    }
}
