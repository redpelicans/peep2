import Yup from 'yup';
import {
  getDefaultValues,
  getOneField,
  getAllFields,
  getOneValidationSchema,
} from './utils';
import { TextAreaField } from '../fields';
import { SelectField, WorkerSelectField } from '../fields/SelectField';
import { PeriodField } from '../fields/DateField';

const fields = {
  period: {
    label: 'Period',
    required: true,
    component: PeriodField,
  },
  type: {
    label: 'Type',
    component: SelectField,
    required: true,
    defaultValue: 'vacation',
    domainValues: [
      { id: '', value: '<None>' },
      { id: 'vacation', value: 'Vacation' },
      { id: 'sickLeaveDay', value: 'Sick Leave Day' },
    ],
    validate: Yup.string(),
  },
  workerId: {
    label: 'Worker',
    component: WorkerSelectField,
    required: true,
    validate: Yup.string(),
  },
  status: {
    label: 'Status',
    defaultValue: 'TBV',
    domainValues: [
      { id: 'TBV', value: 'To Be Validated' },
      { id: 'V', value: 'Validated' },
    ],
    required: true,
    validate: Yup.string(),
    component: SelectField,
  },
  description: {
    label: 'Description',
    component: TextAreaField,
    required: true,
    validate: Yup.string().oneOf(['A', 'B']),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
export default getAllFields(fields);
