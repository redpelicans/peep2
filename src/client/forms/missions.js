import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import { DatesFields } from '../fields/DateField';
import {
  SelectField,
  CompaniesSelectField,
  WorkerSelectField,
} from '../fields/SelectField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  name: {
    label: 'Name',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  dates: {
    label: 'Dates',
    required: true,
    component: DatesFields,
    validate: Yup.array(),
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
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
