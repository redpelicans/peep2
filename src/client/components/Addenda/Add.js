import React from 'react';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft } from '../Header';
import { Formik } from 'formik';
import { getValidationSchema, defaultValues } from '../../forms/addenda';
import { addAddendum } from '../../actions/addenda';
import { Prompt } from 'react-router';
import { Spacer, Title, ModalConfirmation } from '../widgets';
import AddOrEdit from './AddOrEdit';

export const Add = compose(
  withState('isCancelDialogOpen', 'showCancelDialog', false),
  withHandlers({
    requestCancel: ({ showCancelDialog, cancel }) => dirty => () => {
      if (!dirty) return cancel();
      return showCancelDialog(true);
    },
    toggleDialog: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
)(
  ({
    values,
    isSubmitting,
    isValid,
    dirty,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    isCancelDialogOpen,
    showCancelDialog,
    cancel,
    requestCancel,
    ...props
  }) => {
    return (
      <div>
        <Prompt
          when={!isCancelDialogOpen && dirty && !isSubmitting}
          message="Would you like to cancel this form ?"
        />
        <ModalConfirmation
          isOpen={isCancelDialogOpen}
          title="Would you like to cancel this form ?"
          reject={() => showCancelDialog(false)}
          accept={cancel}
        />
        <Header>
          <HeaderLeft>
            <Spacer size={15} />
            <Title title={'Add Addendum'} />
          </HeaderLeft>
        </Header>
        <AddOrEdit
          type="add"
          handleSubmit={handleSubmit}
          values={values}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          {...props}
        />
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={requestCancel(dirty)}
              className="cancel pt-intent-warning pt-large"
            >
              Cancel
            </Button>
            <Button
              form="addendaForm"
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className="submit pt-intent-success pt-large"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

Add.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  clients: PropTypes.object,
};

const actions = { addAddendum };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});

const FormikAdd = ({ missionId, accept, addAddendum, ...props }) => {
  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={getValidationSchema()}
      onSubmit={({ workerId, startDate, endDate, amount, unit, currency }) => {
        const newAddendum = {
          missionId,
          workerId,
          startDate,
          endDate,
          fees: {
            amount: amount,
            unit: unit,
            currency: currency,
          },
        };
        addAddendum(newAddendum);
        accept();
      }}
      render={({ ...others }) => <Add {...props} {...others} />}
    />
  );
};

FormikAdd.propTypes = {
  missionId: PropTypes.string,
  accept: PropTypes.func.isRequired,
  addAddendum: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(FormikAdd);
