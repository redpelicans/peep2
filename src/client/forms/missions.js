import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import {
  SelectField,
  AssigneesSelectField,
  CompaniesSelectField,
  WorkerSelectField,
} from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  name: {
    label: 'Name',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  clientId: {
    label: 'Client',
    component: CompaniesSelectField,
    required: true,
    validate: Yup.string(),
  },
  partnerId: {
    label: 'Partner',
    component: CompaniesSelectField,
    validate: Yup.string(),
  },
  billedTarget: {
    label: 'Billed Target',
    defaultValue: 'client',
    domainValues: [
      { id: 'partner', value: 'Partner' },
      { id: 'client', value: 'Client' },
    ],
    component: SelectField,
    required: true,
    validate: Yup.string(),
  },
  managerId: {
    label: 'Manager',
    component: WorkerSelectField,
    required: true,
    validate: Yup.string(),
  },
  note: {
    label: 'Note',
    component: MarkDownField,
    validate: Yup.string(),
  },
  allowWeekends: {
    label: 'Allow Weekends',
    defaultValue: 'doNotAllow',
    domainValues: [
      { id: 'allow', value: 'Allow' },
      { id: 'doNotAllow', value: 'Do not Allow' },
    ],
    component: SelectField,
    validate: Yup.string(),
  },
  timesheetUnit: {
    label: 'Timesheet Unit',
    defaultValue: 'day',
    domainValues: [{ id: 'day', value: 'Day' }, { id: 'hour', value: 'Hour' }],
    component: SelectField,
    required: true,
    validate: Yup.string(),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
