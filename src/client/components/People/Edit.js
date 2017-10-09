import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { compose, map, isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { withFormik } from 'formik';
import { getPerson } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getPathByName } from '../../routes';
import { getValidationSchema } from '../../forms/peoples';
import { updatePeople } from '../../actions/people';
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

export const Add = ({
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
          formId="peopleForm"
          color={values.color}
          name={values.firstName}
          lastName={values.lastName}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
        <Spacer />
        <Title title={'Edit People'} />
      </HeaderLeft>
      <HeaderRight>
        <Button
          form="peopleForm"
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
  people: PropTypes.object,
  showCancelDialog: PropTypes.func.isRequired,
  isCancelDialogOpen: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  requestCancel: PropTypes.func.isRequired,
};

const actions = { updatePeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} }, history } = props;
  if (getPerson(state, id) === undefined) {
    history.push(getPathByName('notfound'));
  }
  return {
    people: getPerson(state, id),
  };
};

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
      const { updatePeople, history } = props;
      const newPeople = {
        avatar: { color },
        firstName,
        type,
        lastName,
        email,
        jobType,
        note: notes,
        phones: isEmpty(phones)
          ? map(phone => ({ label: phone.type, number: phone.number }), phones)
          : [],
        prefix,
        tags: isEmpty(tags) ? map(tag => tag.value, tags) : [],
        roles: isEmpty(roles) ? map(role => role.value, roles) : [],
      };
      updatePeople(newPeople);
      history.goBack();
    },
    validationSchema: getValidationSchema(),
    mapPropsToValues: ({ people = {}, companies = {} }) => ({
      ...people,
      phones: isEmpty(people.phones) ? people.phones : [],
      color: people.avatar ? people.avatar.color : '',
      company: companies[people.companyId]
        ? companies[people.companyId].name
        : '',
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
