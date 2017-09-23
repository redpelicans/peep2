import Yup from 'yup';
import {
  getOneDefaultValue,
  getDefaultValues,
  getOneField,
  getAllFields,
  getOneValidationSchema,
} from './utils';
import {
  DateField,
  InputField,
  SelectField,
  WorkerSelectField,
} from '../fields';

const fields = {
  startDate: {
    label: 'Start Date',
    component: DateField,
  },
  endDate: {
    label: 'End Date',
    component: DateField,
  },
  unit: {
    label: 'Unit',
    component: InputField,
    defaultValue: 'day',
  },
  value: {
    label: 'Value',
    component: InputField,
    validate: Yup.number(),
  },
  type: {
    label: 'Type',
    component: SelectField,
    defaultValue: 'vacation',
    domainValues: [
      { id: '', value: '<None>' },
      { id: 'vacation', value: 'Vacation' },
      { id: 'sickLeaveDay', value: 'Sick Leave Day' },
    ],
    validate: Yup.string(),
  },
  worker: {
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
    component: InputField,
    validate: Yup.string().oneOf(['A', 'B']),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
export default getAllFields(fields);
