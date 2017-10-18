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
import { getMission } from '../../selectors/missions';
import { getPathByName } from '../../routes';
import { getValidationSchema } from '../../forms/people';
import { updateMission } from '../../actions/people';
import { Prompt } from 'react-router';
import {
  Spacer,
  Title,
  Container,
  AvatarSelector,
  ModalConfirmation,
} from '../widgets';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

export const Edit = compose(
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
          <AvatarSelector
            formId="missionForm"
            color={values.color}
            name={values.firstName}
            lastName={values.lastName}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <Spacer />
          <Title title={'Edit Mission'} />
        </HeaderLeft>
        <HeaderRight>
          <Button
            form="missionForm"
            type="submit"
            disabled={isSubmitting || !dirty}
            className="pt-intent-success pt-large"
          >
            Update
          </Button>
          <Spacer />
          <Button
            onClick={requestCancel(dirty)}
            className="pt-intent-warning pt-large"
          >
            Cancel
          </Button>
          <Spacer />
          <Button
            className="pt-intent-danger pt-large"
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          >
            Reset
          </Button>
          <Spacer size={20} />
        </HeaderRight>
      </Header>
      <AddOrEdit
        type="edit"
        handleSubmit={handleSubmit}
        values={values}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        {...props}
      />
    </StyledContainer>
  ),
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
  mision: PropTypes.object,
};

const actions = { updateMission };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});
const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} }, history } = props;
  console.log('getMission: ', getMission(state, id));
  if (getMission(state, id) === undefined) {
    history.push(getPathByName('notfound'));
  }
  return {
    person: getMission(state, id),
  };
};

const FormikEdit = ({
  updateMission,
  mission = {},
  history,
  dispatch,
  ...props
}) => (
  <Formik
    initialValues={{
      ...mission,
    }}
    validationSchema={getValidationSchema()}
    onSubmit={({
      name,
      clientId,
      partner,
      billedTarget,
      manager,
      allowWeekends,
      timesheetUnit,
      startDate,
      endDate,
      workers,
      note,
      _id,
    }) => {
      const newMission = {
        name,
        clientId,
        partner,
        billedTarget,
        manager,
        allowWeekends,
        timesheetUnit,
        startDate,
        endDate,
        workers,
        note,
        _id,
      };
      updateMission(newMission);
      history.goBack();
    }}
    render={({ ...others }) => (
      <Edit history={history} {...props} {...others} />
    )}
  />
);

FormikEdit.propTypes = {
  updateMission: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  mission: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(FormikEdit);
