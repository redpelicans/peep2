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
  },
  clientId: {
    label: 'Client',
    component: CompaniesSelectField,
    required: true,
  },
  partner: {
    label: 'Partner',
    component: CompaniesSelectField,
  },
  billedTarget: {
    label: 'Billed Target',
    domainValues: [
      { id: 'partner', value: 'Partner' },
      { id: 'client', value: 'Client' },
    ],
    component: SelectField,
  },
  manager: {
    label: 'Manager',
    component: WorkerSelectField,
    required: true,
  },
  workers: {
    label: 'Workers',
    component: AssigneesSelectField,
  },
  note: {
    label: 'Note',
    component: MarkDownField,
  },
  allowWeekends: {
    label: 'Allow Weekends',
    domainValues: [
      { id: 'allow', value: 'Allow' },
      { id: 'doNotAllow', value: 'Do not Allow' },
    ],
    component: SelectField,
  },
  timesheetUnit: {
    label: 'Timesheet Unit',
    domainValues: [{ id: 'day', value: 'Day' }, { id: 'hour', value: 'Hour' }],
    component: SelectField,
  },
  startDate: {
    label: 'Start Date',
    component: DateField,
  },
  endDate: {
    label: 'End Date',
    component: DateField,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
