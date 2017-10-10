import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import {
  TagsSelectField,
  SelectField,
  CompaniesSelectField,
  MultiSelectField,
} from '../fields/SelectField';
import PhoneField from '../fields/PhoneField';
import { MarkDownField } from '../fields/MarkDownField';
import { randomColor } from '../utils/colors';

const fields = {
  prefix: {
    label: 'Prefix',
    defaultValue: 'Mr',
    domainValues: [{ id: 'Mr', value: 'Mr' }, { id: 'Mrs', value: 'Mrs' }],
    required: true,
    component: SelectField,
    validate: Yup.string(),
  },
  firstName: {
    label: 'First Name',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  lastName: {
    label: 'Last Name',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  type: {
    label: 'Types',
    defaultValue: 'contact',
    domainValues: [
      { id: 'client', value: 'Client' },
      { id: 'worker', value: 'Worker' },
      { id: 'contact', value: 'Contact' },
    ],
    required: true,
    component: SelectField,
    validate: Yup.string(),
  },
  email: {
    label: 'Email',
    required: true,
    component: InputField,
    validate: Yup.string().email(),
  },
  jobType: {
    label: 'Job Type',
    domainValues: [
      { id: 'designer', value: 'Designer' },
      { id: 'developer', value: 'Developer' },
      { id: 'manager', value: 'Manager' },
      { id: 'sales', value: 'Sales' },
    ],
    required: true,
    component: SelectField,
    validate: Yup.string(),
  },
  companyId: {
    label: 'Company',
    required: true,
    component: CompaniesSelectField,
    validate: Yup.string(),
  },
  phones: {
    label: 'Phones',
    component: PhoneField,
    validate: Yup.array(),
  },
  tags: {
    label: 'Tags',
    component: TagsSelectField,
  },
  roles: {
    label: 'Roles',
    component: MultiSelectField,
    domainValues: [
      { id: 'admin', value: 'Admin' },
      { id: 'edit', value: 'Edit' },
      { id: 'access', value: 'Access' },
    ],
  },
  notes: {
    label: 'Notes',
    component: MarkDownField,
  },
  color: {
    label: 'Color',
    defaultValue: randomColor(),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
