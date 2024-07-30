import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';

export interface ICalendar extends IBaseRecord {
    start_hour: string;
    date: string;
    end_hour: string;
    teacher: string;
    students_count: string;
    observation: string;
}

export interface ICalendarTable extends ICalendar {
    actions: ITableAction[];
}