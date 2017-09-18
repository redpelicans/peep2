import { format } from 'date-fns';

export const dmy = date => date && format(date, ['DDMMYY']);
