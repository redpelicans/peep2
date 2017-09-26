import { compose, reduce, toPairs } from 'ramda';
import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import {
  TypeSelect,
  TextInput,
  TextAreaInput,
  CitySelect,
  CountrySelect,
  TagsSelect,
} from '../components/widgets';

const fields = {
  types: {
    label: 'Types',
    domainValues: ['Client', 'Partner', 'Tenant'],
    required: true,
    component: TypeSelect,
  },
  name: {
    label: 'Name',
    required: true,
    component: TextInput,
    validate: Yup.string(),
  },
  website: {
    label: 'Website',
    required: true,
    component: TextInput,
    validate: Yup.string(),
  },
  street: {
    label: 'Street',
    required: true,
    component: TextInput,
    validate: Yup.string(),
  },
  zipcode: {
    label: 'Zipcode',
    required: true,
    component: TextInput,
    validate: Yup.string(),
  },
  city: {
    label: 'City',
    required: true,
    component: CitySelect,
  },
  country: {
    label: 'Country',
    required: true,
    component: CountrySelect,
  },
  tags: {
    label: 'Tags',
    component: TagsSelect,
  },
  notes: {
    label: 'Notes',
    component: TextAreaInput,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = () =>
  Yup.object().shape(getOneValidationSchema(fields));
export const exportedFields = compose(
  reduce((acc, [name, r]) => [...acc, { ...r, name }], []),
  toPairs,
)(fields);

export default exportedFields;
