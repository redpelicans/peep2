import { compose, reduce, toPairs } from 'ramda';
import { getDefaultValues } from './utils';
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
    key: 'Types',
    label: 'Types',
    domainValues: ['Client', 'Partner', 'Tenant'],
    required: true,
    component: TypeSelect,
  },
  name: {
    key: 'Name',
    label: 'Name',
    required: true,
    component: TextInput,
  },
  website: {
    key: 'Website',
    label: 'Website',
    required: true,
    component: TextInput,
  },
  street: {
    key: 'Street',
    label: 'Street',
    required: true,
    component: TextInput,
  },
  zipcode: {
    key: 'Zipcode',
    label: 'ZipCode',
    required: true,
    component: TextInput,
  },
  city: {
    key: 'City',
    label: 'City',
    required: true,
    component: CitySelect,
  },
  country: {
    key: 'Country',
    label: 'Country',
    required: true,
    component: CountrySelect,
  },
  tags: {
    key: 'Tags',
    label: 'Tags',
    required: false,
    component: TagsSelect,
  },
  notes: {
    key: 'Notes',
    label: 'Notes',
    required: false,
    component: TextAreaInput,
  },
};

export const defaultValues = getDefaultValues(fields);

export const exportedFields = compose(
  reduce((acc, [name, r]) => [...acc, { ...r, name }], []),
  toPairs,
)(fields);

export default exportedFields;