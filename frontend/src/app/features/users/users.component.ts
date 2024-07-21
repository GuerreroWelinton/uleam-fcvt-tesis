import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
    MatPaginator,
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { Observable, Observer } from 'rxjs';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Elementos por página';
    override nextPageLabel = 'Siguiente página';
    override previousPageLabel = 'Página anterior';
    override firstPageLabel = 'Primera página';
    override lastPageLabel = 'Última página';
    override getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
    ) => {
        if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex =
            startIndex < length
                ? Math.min(startIndex + pageSize, length)
                : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
}

export interface ExampleTab {
    label: string;
    content: string;
}

@Component({
    selector: 'app-users',
    standalone: true,
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    providers: [
        { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FileUploadModule,
        MatTabsModule,
        AsyncPipe,
    ],
})
export class UsersComponent {
    displayedColumns: string[] = [
        'select',
        'userId',
        'name',
        'email',
        'phoneNumber',
        // 'status',
        'action',
    ];

    dataSource = new MatTableDataSource<IUserTable>(USERS_DATA);
    selection = new SelectionModel<IUserTable>(true, []);

    commonStatuses: any = COMMON_STATUSES;

    // File Uploader
    public multiple: boolean = false;

    // Form
    userForm: FormGroup;

    asyncTabs: Observable<ExampleTab[]>;

    constructor(private fb: FormBuilder) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
            setTimeout(() => {
                observer.next([
                    { label: 'Formulario', content: 'form' },
                    { label: 'Plantilla', content: 'template' },
                ]);
            }, 1000);
        });
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: IUserTable): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.userId + 1
        }`;
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSubmit() {
        if (this.userForm.valid) {
            console.log('Form submitted successfully!', this.userForm.value);
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }
}

export interface IUserTable {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    status: COMMON_STATUS;
    action: ICommonTableAction;
}

export interface ICommonStatus {
    label: string;
    class: string;
}

export enum COMMON_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export const COMMON_STATUSES = {
    ACTIVE: {
        label: 'Activo',
        class: 'confirmed',
        value: 'active',
    },
    INACTIVE: {
        label: 'Inactivo',
        class: 'rejected',
        value: 'inactive',
    },
};

export interface ICommonTableAction {
    view: string;
    edit: string;
    delete: string;
}

export const COMMON_TABLE_ACTIONS = {
    view: 'visibility',
    edit: 'edit',
    delete: 'delete',
};

const USERS_DATA: IUserTable[] = [
    {
        userId: 'PROF-001',
        name: 'Mariana Gómez',
        email: 'mariana.gomez@gmail.com',
        phoneNumber: '+593 987654321',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-002',
        name: 'Juan Pérez',
        email: 'juan.perez@gmail.com',
        phoneNumber: '+593 987654322',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-003',
        name: 'Ana López',
        email: 'ana.lopez@gmail.com',
        phoneNumber: '+593 987654323',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-004',
        name: 'Carlos Torres',
        email: 'carlos.torres@gmail.com',
        phoneNumber: '+593 987654324',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-005',
        name: 'María García',
        email: 'maria.garcia@gmail.com',
        phoneNumber: '+593 987654325',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-006',
        name: 'David Rodríguez',
        email: 'david.rodriguez@escuela.edu.ec',
        phoneNumber: '+593 25555560',
        status: COMMON_STATUS.INACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-007',
        name: 'Sandra Sánchez',
        email: 'sandra.sanchez@escuela.edu.ec',
        phoneNumber: '+593 25555561',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-008',
        name: 'Raúl Martínez',
        email: 'raul.martinez@escuela.edu.ec',
        phoneNumber: '+593 25555562',
        status: COMMON_STATUS.INACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-009',
        name: 'Patricia Ortiz',
        email: 'patricia.ortiz@escuela.edu.ec',
        phoneNumber: '+593 25555563',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },

    {
        userId: 'PROF-010',
        name: 'Pedro González',
        email: 'pedro.gonzalez@gmail.com',
        phoneNumber: '+593 987654326',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-011',
        name: 'Isabel Ramírez',
        email: 'isabel.ramirez@gmail.com',
        phoneNumber: '+593 987654327',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-012',
        name: 'Miguel Rodríguez',
        email: 'miguel.rodriguez@gmail.com',
        phoneNumber: '+593 987654328',
        status: COMMON_STATUS.INACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-013',
        name: 'Andrea Sánchez',
        email: 'andrea.sanchez@gmail.com',
        phoneNumber: '+593 987654329',
        status: COMMON_STATUS.ACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
    {
        userId: 'PROF-014',
        name: 'Luis Martínez',
        email: 'luis.martinez@gmail.com',
        phoneNumber: '+593 987654330',
        status: COMMON_STATUS.INACTIVE,
        action: COMMON_TABLE_ACTIONS,
    },
];
