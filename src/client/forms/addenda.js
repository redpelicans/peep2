import Yup from 'yup';
import { is } from 'ramda';
import isDate from 'date-fns/is_date';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import { SelectField, WorkerSelectField } from '../fields/SelectField';
import { DatesFields } from '../fields/DateField';

const fields = {
  workerId: {
    label: 'Worker',
    component: WorkerSelectField,
    required: true,
    validate: Yup.string(),
  },
  dates: {
    label: 'Dates',
    component: DatesFields,
    required: true,
    validate: Yup.array().test(
      'startDate',
      '${path} do not contain startDate',
      dates => is(Array, dates) && dates[0] && isDate(dates[0]),
    ),
  },
  amount: {
    label: 'Amount',
    component: InputField,
    required: true,
    validate: Yup.string(),
  },
  unit: {
    label: 'Unit',
    defaultValue: 'day',
    domainValues: [{ id: 'day', value: 'Day' }],
    component: SelectField,
    required: true,
    validate: Yup.string(),
  },
  currency: {
    label: 'Currency',
    defaultValue: 'EUR',
    domainValues: [{ id: 'EUR', value: 'EUR' }],
    component: SelectField,
    required: true,
    validate: Yup.string(),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
