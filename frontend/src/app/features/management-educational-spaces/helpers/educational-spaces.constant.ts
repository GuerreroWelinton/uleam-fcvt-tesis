import { IEducationalSpaceTable } from '../interfaces/educational-spaces.interface';

export const DISPLAYED_COLUMNS_EDUCATIONAL_SPACES: (keyof IEducationalSpaceTable)[] =
  [
    'name',
    'code',
    'capacity',
    'building',
    'floor',
    // 'hoursOfOperation',
    // 'users',
    'status',
    'actions',
  ];

export const DISPLAYED_COLUMNS_EDUCATIONAL_SPACES_STATISTICS = [
  'date',
  'startTime',
  'endTime',
  'career',
  'subject',
  'teacher',
  'number_participants',
  'attended_count',
  'not_attended_count',
  'status',
];
