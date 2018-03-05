import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import { getValidationSchema, defaultValues } from '../../forms/missions';
import { addMission } from '../../actions/missions';
import { Prompt } from 'react-router';
import { Spacer, Title, Container, ModalConfirmation } from '../widgets';
import AddOrEdit from './AddOrEdit';

export const StyledContainer = styled(Container)`min-width: 300px;`;

export const Add = compose(
  withState('isCancelDialogOpen', 'showCancelDialog', false),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    requestCancel: ({ history, showCancelDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
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
          <Title title={'Add Mission'} />
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
      name,
      clientId,
      partnerId,
      billedTarget,
      managerId,
      allowWeekends,
      timesheetUnit,
      note,
    }) => {
      const { addMission, history } = props;
      const newMission = {
        name,
        clientId,
        partnerId,
        billedTarget,
        managerId,
        allowWeekends: allowWeekends === 'allow' ? true : false,
        timesheetUnit,
        note,
      };
      addMission(newMission);
      history.goBack();
    }}
    render={({ ...others }) => <Add {...props} {...others} />}
  />
);

FormikAdd.propTypes = {
  addMission: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  clients: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(FormikAdd);
