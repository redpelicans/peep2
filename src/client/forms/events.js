import Yup from 'yup';
import { find, prop } from 'ramda';
import {
  getDefaultValues,
  getOneField,
  getAllFields,
  getOneValidationSchema,
} from './utils';
import { SelectField, WorkerSelectField } from '../fields/SelectField';
import { PeriodField } from '../fields/DateField';
import { MarkDownField } from '../fields/MarkDownField';

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
      { id: 'R', value: 'Rejected' },
    ],
    required: true,
    validate: Yup.string(),
    component: SelectField,
  },
  description: {
    label: 'Description',
    component: MarkDownField,
    validate: Yup.string().nullable(),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);

export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
export default getAllFields(fields);
