import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, map, omit } from 'ramda';
import withWorkers from '../hoc/workers';
import withCities from '../hoc/cities';
import withCountries from '../hoc/countries';
import withTags from '../hoc/tags';
import { Field } from '../fields';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import { fullName } from '../utils/people';
import { Colors } from '@blueprintjs/core';

const SelectStyled = styled(Select.Creatable)`
  &.Select--multi {
    .Select-value {
      display: inline-flex;
      align-items: center;
      color: ${Colors.WHITE};
      background-color: ${Colors.DARK_GRAY4};
    }
  }
  & .is-searchable.is-open > .Select-control {
    background-color: ${Colors.DARK_GRAY4};
  }
  & .Select-control {
    border-radius: 2px;
    border: 1px solid ${Colors.DARK_GRAY3};
    background-color: ${Colors.DARK_GRAY4};
    color: ${Colors.WHITE};
  }
  & .is-open > .Select-value {
    background-color: red !important;
  }
  & .Select-clear-zone:hover {
    color: ${Colors.RED3};
  }
  & .Select-value-label {
    color: white !important;
  }
  & .Select-menu-outer {
    border: 0;
    background-color: ${Colors.DARK_GRAY5};
  }
  & .Select-option {
    box-sizing: none;
    background-color: ${Colors.DARK_GRAY4};
    color: ${Colors.LIGHT_GRAY4};
  }
  & .Select-placeholder {
    font-size: smaller;
    color: ${Colors.WHITE};
    background-color: ${Colors.DARK_GRAY4};
    border: 0;
  }
`;

export const SelectField = ({
  name,
  label,
  required,
  value,
  setFieldTouched,
  setFieldValue,
  domainValues,
}) => {
  const handleChange = e => {
    const newValue = e.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  const getOptions = map(value => ({ value: value, label: value }));
  return (
    <Field label={label} required={required}>
      <SelectStyled
        id={label}
        options={getOptions(domainValues)}
        onChange={handleChange}
        value={value}
        name={label}
      />
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
};

export const MultiSelectField = ({
  name,
  label,
  required,
  value,
  setFieldTouched,
  setFieldValue,
  domainValues,
}) => {
  const handleChange = e => {
    const newValue = e;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  const getOptions = map(val => ({ value: val, label: val }));
  return (
    <Field label={label} required={required}>
      <SelectStyled
        id={label}
        options={getOptions(domainValues)}
        onChange={handleChange}
        value={value}
        multi={true}
        name={label}
      />
    </Field>
  );
};

MultiSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  domainValues: PropTypes.array,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

const propTransformer = (src, target, fn) => Component => {
  const Transformer = props => {
    const newProps = { ...omit([src], props), [target]: fn(props[src]) };
    return <Component {...newProps} />;
  };

  Transformer.propTypes = {
    workers: PropTypes.array.isRequired,
  };

  return Transformer;
};

export const WorkerSelectField = compose(
  withWorkers,
  propTransformer(
    'workers',
    'domainValues',
    map(worker => ({ id: worker._id, value: fullName(worker) })),
  ),
)(SelectField);

export const CitiesSelectField = compose(
  withCities,
  propTransformer('cities', 'domainValues', map(city => city)),
)(SelectField);

export const CountriesSelectField = compose(
  withCountries,
  propTransformer('countries', 'domainValues', map(country => country)),
)(SelectField);

export const TagsSelectField = compose(
  withTags,
  propTransformer('tags', 'domainValues', map(tag => tag)),
)(MultiSelectField);
