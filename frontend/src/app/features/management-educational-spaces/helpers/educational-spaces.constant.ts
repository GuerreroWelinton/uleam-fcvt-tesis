import {
  IEducationalSpace,
  IEducationalSpaceTable,
} from '../interfaces/educational-spaces.interface';

export const DISPLAYED_COLUMNS_EDUCATIONAL_SPACES: (keyof IEducationalSpaceTable)[] =
  [
    'name',
    'code',
    'capacity',
    // 'building',
    'floor',
    // 'hoursOfOperation',
    // 'users',
    'status',
    'actions',
  ];
