import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DateInput } from '@blueprintjs/datetime';
import { Icon, Colors } from '@blueprintjs/core';
import { isEqual } from 'date-fns';
import { compose, map, omit } from 'ramda';
import { fullName } from '../utils/people';
import { withWorkers } from '../hoc';
import '@blueprintjs/datetime/dist/blueprint-datetime.css';

export const FormField = ({ field, values, errors, className, ...props }) => {
  const newProps =
    'domainValues' in field
      ? { ...props, domainValues: field.domainValues }
      : props;
  return (
    <div className={className}>
      <field.component
        name={field.name}
        label={'label' in props ? props.label : field.label}
        value={'value' in props ? props.value : values[field.name]}
        error={errors && errors[field.name]}
        required={!!field.required}
        {...newProps}
      />
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.node,
  values: PropTypes.object,
  errors: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
};

const StyledFormField = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-auto-flow: row;
`;

const StyledRequiredTag = styled.span`
  margin-left: 5px;
  color: ${Colors.RED5};
`;

const RequiredTag = ({ required }) => {
  if (!required) return null;
  return <StyledRequiredTag>*</StyledRequiredTag>;
};

RequiredTag.propTypes = {
  required: PropTypes.bool.isRequired,
};

const Error = styled.span`
  font-size: 0.9em;
  font-style: italic;
  color: ${Colors.RED5};
  margin-top: 5px;
`;

const Field = ({ label, error, required, children }) => (
  <StyledFormField>
    <label className="pt-label">
      {label}
      <RequiredTag required={required} />
    </label>
    {children}
    <Error>{error && `Error: ${error}`}</Error>
  </StyledFormField>
);

Field.propTypes = {
  children: PropTypes.func.element,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
};

export const InputField = ({
  name,
  label,
  error,
  required,
  value = '',
  setFieldTouched,
  setFieldValue,
  ...props
}) => {
  const handleChange = e => {
    const newValue = e.target.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };

  return (
    <Field label={label} error={error} required={required}>
      <input
        name={name}
        className="pt-input pt-fill"
        value={value}
        onChange={handleChange}
        dir="auto"
        {...props}
      />
    </Field>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

const StyledInputIcon = styled(Icon)`margin-right: 4px;`;

export const DateField = ({
  name,
  label,
  required,
  value,
  setFieldValue,
  setFieldTouched,
  ...props
}) => {
  const icon = <StyledInputIcon iconName="calendar" />;
  const handleChange = newValue => {
    setFieldTouched(name, !isEqual(newValue, value));
    setFieldValue(name, newValue);
  };

  return (
    <Field label={label} required={required}>
      <DateInput
        rightElement={icon}
        className="pt-datepicker pt-fill"
        name={name}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </Field>
  );
};

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

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
