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
import { getCompany } from '../../selectors/companies';
import { getPathByName } from '../../routes';
import { getValidationSchema } from '../../forms/companies';
import { updateCompany } from '../../actions/companies';
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
          formId="addCompany"
          color={values.avatar ? values.avatar.color : ''}
          name={values.name}
          lastName={values.lastName}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
        <Spacer />
        <Title title={'Edit Company'} />
      </HeaderLeft>
      <HeaderRight>
        <Button
          form="addCompany"
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
  company: PropTypes.object,
  showCancelDialog: PropTypes.func.isRequired,
  isCancelDialogOpen: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  requestCancel: PropTypes.func.isRequired,
};

const actions = { updateCompany };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} }, history } = props;
  if (getCompany(state, id) === undefined) {
    history.push(getPathByName('notfound'));
  }
  return {
    company: getCompany(state, id),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    handleSubmit: (
      {
        avatar,
        name,
        note,
        tags,
        type,
        website,
        zipcode,
        street,
        country,
        city,
      },
      { props },
    ) => {
      const { updateCompany, history } = props;
      const newCompany = {
        address: { street, zipcode, city, country },
        avatar,
        name,
        note,
        tags: isEmpty(tags) ? map(tag => tag.value, tags) : [],
        website,
        type,
      };
      updateCompany(newCompany);
      history.goBack();
    },
    validationSchema: getValidationSchema(),
    mapPropsToValues: ({ company = { address: {} } }) => ({
      ...company,
      street: company.address.street ? company.address.street : '',
      zipcode: company.address.zipcode ? company.address.zipcode : '',
      city: company.address.city ? company.address.city : '',
      country: company.address.country ? company.address.country : '',
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
