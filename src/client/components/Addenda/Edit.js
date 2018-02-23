import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import { getValidationSchema, defaultValues } from '../../forms/addenda';
import { updateAddendum } from '../../actions/addenda';
import { Prompt } from 'react-router';
import { Spacer, Title, ModalConfirmation } from '../widgets';
import AddOrEdit from './AddOrEdit';
import { getCompanies } from '../../selectors/companies';

export const Edit = compose(
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
    handleReset,
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

Edit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  clients: PropTypes.object,
};

const actions = { updateAddendum };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});

const formatDefaultValues = ({ fees, ...rest }) => ({
  ...fees,
  ...rest,
});

const FormikEdit = ({ accept, updateAddendum, defaultValues, ...props }) => {
  const _id = defaultValues._id;
  // console.log('Id: ', _id);
  return (
    <Formik
      initialValues={formatDefaultValues(defaultValues)}
      validationSchema={getValidationSchema()}
      onSubmit={({
        missionId,
        workerId,
        startDate,
        endDate,
        amount,
        unit,
        currency,
      }) => {
        const newAddendum = {
          _id,
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
        // console.log('Addendum: ', newAddendum);
        updateAddendum(newAddendum);
        accept();
      }}
      render={({ ...others }) => <Edit {...props} {...others} />}
    />
  );
};

FormikEdit.propTypes = {
  accept: PropTypes.func.isRequired,
  updateAddendum: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(FormikEdit);
