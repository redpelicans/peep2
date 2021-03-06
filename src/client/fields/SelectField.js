import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'react-select/dist/react-select.css';
import { compose, map } from 'ramda';
import { propTransformer } from '../hoc';
import withWorkers from '../hoc/workers';
import withCities from '../hoc/cities';
import withCountries from '../hoc/countries';
import withTags from '../hoc/tags';
import withPeople from '../hoc/people';
import withCompanies from '../hoc/companies';
import { Field } from '../fields';
import Select from 'react-select';
import { fullName } from '../utils/people';

import './react-select.css';
import './react-select-override.css';

const SelectCreatableStyled = styled(Select.Creatable)``;
const SelectStyled = styled(Select)``;

export const SelectField = ({
  name,
  label,
  required,
  value,
  setFieldTouched,
  setFieldValue,
  domainValues,
  creatable = false,
  clearable = false,
  ...props
}) => {
  const handleChange = e => {
    if (!e) {
      setFieldTouched(name, newValue !== value);
      setFieldValue(name, '');
      return;
    }
    const newValue = e.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  const getOptions = map(value => ({ value: value.id, label: value.value }));
  return (
    <Field label={label} required={required}>
      {creatable ? (
        <SelectCreatableStyled
          placeholder={`Select ${label}...`}
          id={label}
          options={getOptions(domainValues)}
          onChange={handleChange}
          clearable={clearable}
          value={value}
          name={label}
          {...props}
        />
      ) : (
        <SelectStyled
          placeholder={`Select ${label}...`}
          id={label}
          options={getOptions(domainValues)}
          clearable={clearable}
          onChange={handleChange}
          value={value}
          name={label}
          {...props}
        />
      )}
    </Field>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  domainValues: PropTypes.array,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  creatable: PropTypes.bool,
  clearable: PropTypes.bool,
};

export const MultiSelectField = ({
  name,
  label,
  required,
  value,
  setFieldTouched,
  setFieldValue,
  domainValues,
  creatable = false,
  clearable = false,
  ...props
}) => {
  const handleChange = e => {
    const newValue = e;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  const getOptions = map(value => ({ value: value.id, label: value.value }));
  return (
    <Field label={label} required={required}>
      {creatable ? (
        <SelectCreatableStyled
          placeholder={`Select ${label}...`}
          id={label}
          multi={true}
          options={getOptions(domainValues)}
          clearable={clearable}
          onChange={handleChange}
          value={value}
          name={label}
          {...props}
        />
      ) : (
        <SelectStyled
          placeholder={`Select ${label}...`}
          id={label}
          multi={true}
          options={getOptions(domainValues)}
          clearable={clearable}
          onChange={handleChange}
          value={value}
          name={label}
          {...props}
        />
      )}
    </Field>
  );
};

MultiSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  domainValues: PropTypes.array,
  value: PropTypes.array,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  creatable: PropTypes.bool,
  clearable: PropTypes.bool,
};

export const WorkerSelectField = compose(
  withWorkers,
  propTransformer(
    'workers',
    'domainValues',
    map(worker => ({ id: worker._id, value: fullName(worker) })),
  ),
)(SelectField);

export const AssigneesSelectField = compose(
  withWorkers,
  propTransformer(
    'workers',
    'domainValues',
    map(worker => ({ id: worker._id, value: fullName(worker) })),
  ),
)(MultiSelectField);

export const PeopleSelectField = compose(
  withPeople,
  propTransformer(
    'people',
    'domainValues',
    map(person => ({ id: person._id, value: person.name })),
  ),
)(SelectField);

export const CitiesSelectField = compose(
  withCities,
  propTransformer(
    'cities',
    'domainValues',
    map(city => ({ id: city, value: city })),
  ),
)(SelectField);

export const CountriesSelectField = compose(
  withCountries,
  propTransformer(
    'countries',
    'domainValues',
    map(country => ({ id: country, value: country })),
  ),
)(SelectField);

export const TagsSelectField = compose(
  withTags,
  propTransformer(
    'tags',
    'domainValues',
    map(tag => ({ id: tag, value: tag })),
  ),
)(MultiSelectField);

export const CompaniesSelectField = compose(
  withCompanies,
  propTransformer(
    'companies',
    'domainValues',
    map(company => ({ id: company._id, value: company.name })),
  ),
)(SelectField);
