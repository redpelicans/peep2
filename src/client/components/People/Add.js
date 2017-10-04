import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button, Dialog } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { withFormik } from 'formik';
import { getVisibleCompanies } from '../../selectors/companies';
import { getValidationSchema, defaultValues } from '../../forms/peoples';
import { addPeople } from '../../actions/people';
import { Spacer, Title, Container, AvatarSelector } from '../widgets';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

export const Add = ({
  isDialogOpen,
  toggleDialog,
  values,
  isSubmitting,
  isValid,
  dirty,
  handleSubmit,
  handleReset,
  setFieldTouched,
  setFieldValue,
  leave,
  cancel,
  ...props
}) => (
  <StyledContainer>
    <Dialog isOpen={isDialogOpen} className="pt-dark">
      <div className="pt-dialog-body">Would you like to cancel this form?</div>
      <div className="pt-dialog-footer">
        <div className="pt-dialog-footer-actions">
          <Button
            onClick={() => toggleDialog()}
            className="pt-intent-warning pt-large"
          >
            No
          </Button>
          <Button
            onClick={() => leave()}
            className="pt-intent-success pt-large"
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
    <Header>
      <HeaderLeft>
        <Spacer size={15} />
        <AvatarSelector
          formId="companyForm"
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
          form="companyForm"
          type="submit"
          disabled={isSubmitting || !isValid || !dirty}
          className="pt-intent-success pt-large"
        >
          Create
        </Button>
        <Spacer />
        <Button onClick={cancel(dirty)} className="pt-intent-warning pt-large">
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
  leave: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
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
        name: `${firstName} ${lastName}`,
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
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    leave: ({ history }) => () => history.goBack(),
    cancel: ({ history, showDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showDialog(isDialogOpen => !isDialogOpen);
    },
    toggleDialog: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
)(Add);
