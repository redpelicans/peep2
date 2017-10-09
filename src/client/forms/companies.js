import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import {
  TagsSelectField,
  SelectField,
  CitiesSelectField,
  CountriesSelectField,
} from '../fields/SelectField';
import { MarkDownField } from '../fields/MarkDownField';
import { randomColor } from '../utils/colors';

const fields = {
  type: {
    label: 'Type',
    domainValues: [
      { id: '', value: 'none' },
      { id: 'client', value: 'Client' },
      { id: 'partner', value: 'Partner' },
      { id: 'tenant', value: 'Tenant' },
    ],
    required: true,
    component: SelectField,
    validate: Yup.string(),
  },
  name: {
    label: 'Name',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  website: {
    label: 'Website',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  street: {
    label: 'Street',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  zipcode: {
    label: 'Zipcode',
    required: true,
    component: InputField,
    validate: Yup.string(),
  },
  city: {
    label: 'City',
    required: true,
    component: CitiesSelectField,
    validate: Yup.string(),
  },
  country: {
    label: 'Country',
    required: true,
    component: CountriesSelectField,
    validate: Yup.string(),
  },
  tags: {
    label: 'Tags',
    component: TagsSelectField,
  },
  notes: {
    label: 'Note',
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
