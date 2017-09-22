import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateInput } from '@blueprintjs/datetime';
import { compose } from 'recompose';
import { map } from 'ramda';
import { getSortedWorkers } from '../selectors/people';
import { fullName } from '../utils/people';

export const SchemaField = ({ field, values, ...props }) => <field.component field={field} value={values[field.name]} {...props} />;

SchemaField.propTypes = {
  field: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

export const InputTextField = ({ field, className, value = '', onChange }) => {
  const { label, placeholder } = field;
  return (
    <div className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
        <input name={field.name} className="pt-input pt-fill" placeholder={placeholder} value={value} onChange={onChange} dir="auto" type="text" />
      </label>
    </div>
  );
};

InputTextField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const DateField = ({ field, className, value = '', onChange }) => {
  const { label, placeholder } = field;
  return (
    <div className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
        <DateInput className="pt-datepicker" name={field.name} value={value} onChange={onChange} />
      </label>
    </div>
  );
};

DateField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  workers: getSortedWorkers('firstName')(state),
});

const enhance = compose(connect(mapStateToProps));

export const WorkerSelectField = enhance(({ field, value = '', onChange, className, workers }) => {
  const { label, placeholder } = field;
  return (
    <div className={className}>
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
    </div>
  );
});

WorkerSelectField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
  workers: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
