import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField, TextAreaField } from '../fields';
import {
  TagsSelectField,
  SelectField,
  CitiesSelectField,
  CountriesSelectField,
} from '../fields/SelectField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  types: {
    label: 'Types',
    domainValues: ['Client', 'Partner', 'Tenant'],
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
    label: 'Notes',
    component: MarkDownField,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
