import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { compose, map, omit } from 'ramda';
import { withWorkers } from '../hoc';
import { Field, StyledInputIcon } from '../fields';
import { fullName } from '../utils/people';

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
    const newValue = e.target.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };

  return (
    <Field label={label} required={required}>
      <div className="pt-select">
        <select value={value} name={name} onChange={handleChange}>
          {map(
            dm => (
              <option key={dm.id} value={dm.id}>
                {dm.value}
              </option>
            ),
            domainValues,
          )}
        </select>
      </div>
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
