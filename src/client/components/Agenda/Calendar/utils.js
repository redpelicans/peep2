import { Colors } from '@blueprintjs/core';
import { isValidated, isRejected } from '../../../utils/events';

const rejected = `repeating-linear-gradient(45deg, ${Colors.RED1}, ${Colors.RED1} 7%, ${Colors.RED3} 7%, ${Colors.RED3} 14%)`;
export const vacationDayBackground = event => {
  const toBeValidated = `repeating-linear-gradient(45deg, ${Colors.GREEN1}, ${Colors.GREEN1} 7%, ${Colors.GREEN3} 7%, ${Colors.GREEN3} 14%)`;
  const validated = Colors.GREEN3;
  if (!event) return validated;
  if (isValidated(event)) return validated;
  if (isRejected(event)) return rejected;
  return toBeValidated;
};

export const sickLeaveDayBackground = event => {
  const toBeValidated = `repeating-linear-gradient(45deg, ${Colors.LIME1}, ${Colors.LIME1} 7%, ${Colors.LIME3} 7%, ${Colors.LIME3} 14%)`;
  const validated = Colors.LIME3;
  if (!event) return validated;
  if (isValidated(event)) return validated;
  if (isRejected(event)) return rejected;
  return toBeValidated;
};

export const spareDayBackground = Colors.GRAY1;
export const workingDayBackground = Colors.DARK_GRAY4;
export const selectedBackground = Colors.GREEN5;
