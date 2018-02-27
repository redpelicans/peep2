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
    required: true,
  },
  endDate: {
    label: 'End Date',
    component: DateField,
    // required: true,
  },
  amount: {
    label: 'Amount',
    component: InputField,
    required: true,
  },
  unit: {
    label: 'Unit',
    defaultValue: 'day',
    domainValues: [{ id: 'day', value: 'Day' }, { id: 'hour', value: 'Hour' }],
    component: SelectField,
    required: true,
  },
  currency: {
    label: 'Currency',
    defaultValue: 'EUR',
    domainValues: [{ id: 'eur', value: 'EUR' }, { id: 'usd', value: 'USD' }],
    component: SelectField,
    required: true,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
