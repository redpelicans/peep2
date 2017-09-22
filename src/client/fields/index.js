import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map } from 'ramda';
import { getSortedWorkers } from '../selectors/people';
import { fullName } from '../utils/people';

export const SchemaField = ({ field, ...props }) => <Field component={field.component} name={field.name} field={field} {...props} />;

SchemaField.propTypes = {
  field: PropTypes.object.isRequired,
};

export const InputTextField = ({ field, className }) => {
  const { label, placeholder } = field;
  return (
    <div className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
        <input className="pt-input pt-fill" placeholder={placeholder} dir="auto" type="text" />
      </label>
    </div>
  );
};

InputTextField.propTypes = {
  field: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const mapStateToProps = state => ({
  workers: getSortedWorkers('firstName')(state),
});

const enhance = compose(connect(mapStateToProps));

export const WorkerSelectField = enhance(({ field, className, workers }) => {
  const { label, placeholder } = field;
  return (
    <div className={className}>
      <label className="pt-label">
        {label}
        <span className="pt-text-muted">(*)</span>
        <div className="pt-select">
          <select>
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
};
