import React from 'react';
import PropTypes from 'prop-types';
import { format, isEqual } from 'date-fns';
import { DateInput, DateRangeInput } from '@blueprintjs/datetime';
// import '@blueprintjs/datetime/dist/blueprint-datetime.css';
import { Field, StyledInputIcon } from '../fields';
import './date-overrride.css';

export const DateField = ({
  name,
  label,
  required,
  value,
  setFieldValue,
  setFieldTouched,
  ...props
}) => {
  const icon = <StyledInputIcon icon="calendar" />;
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

export const DatesFields = ({
  name,
  label,
  required,
  value,
  setFieldValue,
  setFieldTouched,
  ...props
}) => {
  const handleChange = newValue => {
    setFieldTouched(name, !isEqual(newValue, value));
    setFieldValue(name, newValue);
  };
  return (
    <Field label={label} required={required}>
      <DateRangeInput
        startInputProps={{ className: 'pt-datepicker pt-fill' }}
        endInputProps={{ className: 'pt-datepicker pt-fill' }}
        name={name}
        value={value}
        onChange={handleChange}
        formatDate={value => format(value, 'MMM Do YYYY')}
        parseDate={value => new Date(value)}
        {...props}
      />
    </Field>
  );
};

DatesFields.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.array,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export const PeriodField = ({
  name,
  label,
  required,
  value,
  setFieldValue,
  setFieldTouched,
  ...props
}) => {
  const icon = <StyledInputIcon icon="calendar" />;
  const handleChange = newValue => {
    setFieldTouched(name, !isEqual(newValue, value));
    setFieldValue(name, newValue);
  };

  return (
    <Field label={label} required={required}>
      <DateRangeInput
        startInputProps={{ rightElement: icon }}
        endInputProps={{ rightElement: icon }}
        name={name}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </Field>
  );
};

PeriodField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.array,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};
