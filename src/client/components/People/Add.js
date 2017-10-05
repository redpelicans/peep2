import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { withFormik } from 'formik';
import { getVisibleCompanies } from '../../selectors/companies';
import { getValidationSchema, defaultValues } from '../../forms/peoples';
import { addPeople } from '../../actions/people';
import {
  Spacer,
  Title,
  Container,
  AvatarSelector,
  ModalConfirmation,
} from '../widgets';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

export const Add = ({
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
      handleSubmit={handleSubmit}
      values={values}
      setFieldTouched={setFieldTouched}
      setFieldValue={setFieldValue}
      {...props}
    />
  </StyledContainer>
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
  showCancelDialog: PropTypes.func.isRequired,
  isCancelDialogOpen: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  requestCancel: PropTypes.func.isRequired,
};

const actions = { addPeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    handleSubmit: (
      {
        color,
        firstName,
        type,
        lastName,
        notes,
        phones = [],
        prefix,
        tags = [],
        roles = [],
        jobType,
        email,
      },
      { props },
    ) => {
      const { addPeople, history } = props;
      const newPeople = {
        avatar: { color },
        firstName,
        type,
        lastName,
        email,
        jobType,
        note: notes,
        phones: map(
          phone => ({ label: phone.type, number: phone.number }),
          phones,
        ),
        prefix,
        tags: map(tag => tag.value, tags),
        roles: map(role => role.value, roles),
      };
      addPeople(newPeople);
      history.goBack();
    },
    validationSchema: getValidationSchema(),
    mapPropsToValues: () => ({
      ...defaultValues,
    }),
  }),
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
)(Add);
