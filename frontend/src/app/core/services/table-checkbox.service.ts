import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
    providedIn: 'root',
})
export class TableCheckboxService {
    constructor() {}

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected<T>(
        selection: SelectionModel<T>,
        dataSource: MatTableDataSource<T>
    ): boolean {
        const numSelected = selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public toggleAllRows<T>(
        selection: SelectionModel<T>,
        dataSource: MatTableDataSource<T>
    ): SelectionModel<T> {
        if (this.isAllSelected(selection, dataSource)) {
            selection.clear();
        } else {
            selection.select(...dataSource.data);
        }
        return selection;
    }

    /** The label for the checkbox on the passed row */
    public checkboxLabel<T, K extends keyof T>(
        selection: SelectionModel<T>,
        dataSource: MatTableDataSource<T>,
        property: K,
        row?: T
    ): string {
        if (!row) {
            return `${
                this.isAllSelected(selection, dataSource)
                    ? 'deselect'
                    : 'select'
            } all`;
        }
        return `${selection.isSelected(row) ? 'deselect' : 'select'} row ${
            Number(row[property]) + 1
        }`;
    }
}
