import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { addCompany } from '../../actions/companies';
import { compose, isEmpty, map } from 'ramda';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getValidationSchema, defaultValues } from '../../forms/companies';
import AddOrEdit from './AddOrEdit';
import {
  Spacer,
  Title,
  Container,
  AvatarSelector,
  ModalConfirmation,
} from '../widgets';

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
          formId="addCompany"
          color={values.color}
          name={values.name}
          lastName={values.lastName}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
        <Spacer />
        <Title title={'Add Company'} />
      </HeaderLeft>
      <HeaderRight>
        <Button
          form="addCompany"
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

const actions = { addCompany };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withFormik({
    handleSubmit: (
      {
        name,
        type,
        tags = [],
        website,
        zipcode,
        street,
        country,
        city,
        notes = '',
        color,
      },
      { props },
    ) => {
      const { addCompany, history } = props;
      const newCompany = {
        name,
        avatar: { color },
        type,
        tags: isEmpty(tags) ? map(tag => tag.value, tags) : [],
        website,
        address: { street, city, zipcode, country },
        notes,
      };
      addCompany(newCompany);
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
