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
import { getValidationSchema, defaultValues } from '../../forms/missions';
import { addMission } from '../../actions/missions';
import { Prompt } from 'react-router';
import { Spacer, Title, Container, ModalConfirmation } from '../widgets';
import AddOrEdit from './AddOrEdit';
import { getCompanies } from '../../selectors/companies';

export const StyledContainer = styled(Container)`min-width: 300px;`;

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
    handleReset,
    setFieldTouched,
    setFieldValue,
    isCancelDialogOpen,
    showCancelDialog,
    cancel,
    requestCancel,
    ...props
  }) => (
    <StyledContainer>
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
        <HeaderRight>
          <Button
            form="missionForm"
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="submit pt-intent-success pt-large"
          >
            Create
          </Button>
          <Spacer />
          <Button
            onClick={requestCancel(dirty)}
            className="cancel pt-intent-warning pt-large"
          >
            Cancel
          </Button>
          <Spacer />
          <Button
            className="reset pt-intent-danger pt-large"
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          >
            Reset
          </Button>
          <Spacer size={20} />
        </HeaderRight>
      </Header>
      <AddOrEdit
        type="add"
        handleSubmit={handleSubmit}
        values={values}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        {...props}
      />
    </StyledContainer>
  ),
);

Add.propTypes = {
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

const actions = { addMission };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});

const FormikAdd = props => (
  <Formik
    initialValues={defaultValues}
    validationSchema={getValidationSchema()}
    onSubmit={({
      workerId,
      startDate,
      endDate,
      amount,
      unit,
      // currency,
    }) => {
      // const { addMission } = props;
      const newAddendum = {
        workerId,
        startDate,
        endDate,
        fees: {
          amout: amount,
          unit: unit,
          // currency: currency,
        },
      };
      // console.log('Submit, values: ', values)
      console.log(newAddendum);
      // addMission(newMission);
    }}
    render={({ ...others }) => <Add {...props} {...others} />}
  />
);

FormikAdd.propTypes = {
  addMission: PropTypes.func.isRequired,
  clients: PropTypes.object,
};

const mapStateToProps = state => ({
  //clients: getClients(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikAdd);
