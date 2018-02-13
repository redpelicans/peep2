import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import { SelectField, WorkerSelectField } from '../fields/SelectField';
import { DateField } from '../fields/DateField';

const fields = {
  workerId: {
    label: 'Worker',
    component: WorkerSelectField,
    required: true,
  },
  startDate: {
    label: 'Start Date',
    component: DateField,
  },
  endDate: {
    label: 'End Date',
    component: DateField,
  },
  amount: {
    label: 'Amount',
    component: InputField,
    required: true,
  },
  timesheetUnit: {
    label: 'Timesheet Unit',
    defaultValue: 'day',
    domainValues: [{ id: 'day', value: 'Day' }, { id: 'hour', value: 'Hour' }],
    component: SelectField,
    required: true,
  },
  currency: {
    label: 'Currency',
    defaultValue: 'euro',
    domainValues: [
      { id: 'euro', value: 'Euro' },
      { id: 'dollar', value: 'Dollar' },
    ],
    component: SelectField,
    required: true,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
