import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { Prompt } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import { getValidationSchema, defaultValues } from '../../forms/people';
import { addPeople, checkEmail } from '../../actions/people';
import { getRedpelicans } from '../../selectors/companies';
import {
  Spacer,
  Title,
  Container,
  AvatarSelector,
  ModalConfirmation,
} from '../widgets';
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
          <AvatarSelector
            formId="peopleForm"
            color={values.color}
            name={values.firstName}
            lastName={values.lastName}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <Spacer />
          <Title title={'Add People'} />
        </HeaderLeft>
        <HeaderRight>
          <Button
            form="peopleForm"
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="pt-intent-success pt-large"
          >
            Create
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
};

const actions = { addPeople };
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch,
});

const FormikAdd = ({ dispatch, ...props }) => (
  <Formik
    initialValues={defaultValues}
    validationSchema={getValidationSchema({
      email: {
        name: 'isUniq',
        message: 'Email already exists',
        test: email => dispatch(checkEmail({ next: email })),
      },
    })}
    onSubmit={({
      color,
      firstName,
      type,
      lastName,
      note,
      phones = [],
      prefix,
      tags = [],
      roles = [],
      jobType,
      email,
      companyId,
    }) => {
      const { addPeople, history } = props;
      const newPeople = {
        avatar: { color },
        firstName,
        type,
        lastName,
        email,
        jobType,
        note,
        phones: map(
          phone => ({ label: phone.type, number: phone.number }),
          phones,
        ),
        prefix,
        tags: map(tag => tag.value, tags),
        roles: map(role => role.value, roles),
        companyId,
      };
      addPeople(newPeople);
      history.goBack();
    }}
    render={({ ...others }) => <Add {...props} {...others} />}
  />
);

FormikAdd.propTypes = {
  addPeople: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  redpelicans: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  redpelicans: getRedpelicans(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikAdd);
