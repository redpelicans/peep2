import { Colors } from '@blueprintjs/core';
import { isValidated } from '../../../utils/events';

export const vacationDayBackground = event =>
  event && !isValidated(event)
    ? `repeating-linear-gradient(45deg, ${Colors.GREEN1}, ${Colors.GREEN1} 7%, ${Colors.GREEN3} 7%, ${Colors.GREEN3} 14%)`
    : Colors.GREEN3;
export const sickLeaveDayBackground = event =>
  event && !isValidated(event)
    ? `repeating-linear-gradient(45deg, ${Colors.RED1}, ${Colors.RED1} 7%, ${Colors.RED3} 7%, ${Colors.RED3} 14%)`
    : Colors.RED3;
export const spareDayBackground = Colors.GRAY1;
export const workingDayBackground = Colors.DARK_GRAY4;
export const selectedBackground = Colors.GREEN5;
