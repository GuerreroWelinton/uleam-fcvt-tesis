import { DAY_OF_WEEK } from "../constants/constants";
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

  static isHoursOfOperationValid = (
    hoursOperation: IHoursOfOperation[]
  ): boolean => {
    return hoursOperation.every(({ startTime, endTime }) => {
      return (
        this.isValidHourRange.test(startTime) &&
        this.isValidHourRange.test(endTime)
      );
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
