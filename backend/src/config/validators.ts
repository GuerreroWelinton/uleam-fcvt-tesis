import { DAY_OF_WEEK, ERROR_MESSAGES } from "../constants/constants";
import { IHoursOfOperation } from "../domain/interfaces";

export class Validators {
  static get email() {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  }

  static get id() {
    return /^[0-9a-fA-F]{24}$/;
  }

  static get isValidHourRange() {
    return /^(closed|^([0-1][0-9]|2[0-3]):([0-5][0-9]))$/;
  }

  static isValidDate(date: string): boolean {
    try {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    } catch (error) {
      return false;
    }
  }

  static isValidArrayElements(array: any, validValues: any[]): boolean {
    try {
      const values = Array.isArray(array) ? array : [array];
      const invalidValues = values.filter((value) => !validValues.includes(value));
      return invalidValues.length === 0;
    } catch (error) {
      return false;
    }
  }

  static isHoursOfOperationValid = (hoursOperation: IHoursOfOperation[]): boolean => {
    return hoursOperation.every(({ startTime, endTime }) => {
      return this.isValidHourRange.test(startTime) && this.isValidHourRange.test(endTime);
    });
  };

  static isHoursOfOperationArray = (
    hoursOfOperation: IHoursOfOperation[] | any[]
  ): hoursOfOperation is IHoursOfOperation[] => {
    return Object.values(DAY_OF_WEEK).every((dayOfWeek) => {
      return hoursOfOperation.some((hour) => hour.dayOfWeek === dayOfWeek);
    });
  };
}
