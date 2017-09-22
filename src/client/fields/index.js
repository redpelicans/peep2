import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { DateInput } from '@blueprintjs/datetime';
import { Icon } from '@blueprintjs/core';
import { compose } from 'recompose';
import { isEqual } from 'date-fns';
import { map } from 'ramda';
import { getSortedWorkers } from '../selectors/people';
import { fullName } from '../utils/people';
import '@blueprintjs/datetime/dist/blueprint-datetime.css';

const StyledField = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-auto-flow: row;
`;

export const InputTextField = ({ field, value = '', onChange }) => {
  const { label, placeholder } = field;
  return (
    <StyledField>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
      </label>
      <input name={field.name} className="pt-input pt-fill" placeholder={placeholder} value={value} onChange={onChange} dir="auto" type="text" />
    </StyledField>
  );
};

InputTextField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const StyledInputIcon = styled(Icon)`margin-right: 4px;`;

export const DateField = ({ field, className, value, setFieldValue, setFieldTouched }) => {
  const { label, placeholder } = field;
  const icon = <StyledInputIcon iconName="calendar" />;
  const handleChange = newValue => {
    setFieldTouched(field.name, !isEqual(newValue, value));
    setFieldValue(field.name, newValue);
  };

  return (
    <StyledField className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
      </label>
      <DateInput rightElement={icon} className="pt-datepicker pt-fill" name={field.name} value={value} onChange={handleChange} />
    </StyledField>
  );
};

DateField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
  value: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  workers: getSortedWorkers('firstName')(state),
});

const enhance = compose(connect(mapStateToProps));

export const WorkerSelectField = enhance(({ field, value = '', onChange, className, workers }) => {
  const { label, placeholder } = field;

  return (
    <StyledField className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
        <div className="pt-select">
          <select value={value} name={field.name} onChange={onChange}>
            <option selected>Choose a worker...</option>
            {map(
              worker => (
                <option key={worker._id} value={worker._id}>
                  {fullName(worker)}
                </option>
              ),
              workers,
            )}
          </select>
        </div>
      </label>
    </StyledField>
  );
});

WorkerSelectField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
  workers: PropTypes.array,
  value: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
};
