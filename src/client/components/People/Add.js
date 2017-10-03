import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button, Dialog } from '@blueprintjs/core';
import { compose, map } from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import {
  getValidationSchema,
  getField,
  defaultValues,
} from '../../forms/peoples';
import { addPeople } from '../../actions/people';
import { Spacer, Title, Container, AvatarSelector } from '../widgets';
import { onlyUpdateForKeys } from 'recompose';
import { FormField } from '../../fields';

const PeopleForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'Prefix' 'FirstName' 'LastName' 'Types' 'Email' 'JobType'
    'Company' 'Phones' 'Tags' 'Roles' 'Notes';
  @media (min-width: 700px) {
    grid-template-areas: 'Prefix FirstName LastName' 'Types Email JobType'
      'Company Company Company' 'Phones Phones Phones' 'Tags Tags Tags'
      'Roles Roles Roles' 'Notes Notes Notes';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.label};
`;

const Form = ({
  initialValues,
  changeColor,
  history,
  showDialogHandler,
  addPeople,
  title,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={getValidationSchema()}
    isInitialValid={({ validationSchema, initialValues }) =>
      validationSchema.isValid(initialValues)}
    onSubmit={({
      color,
      firstName,
      type,
      lastName,
      notes,
      phones = [],
      prefix,
      tags = [],
      roles,
      jobType,
      email,
      company,
    }) => {
      const newPeople = {
        avatar: { color },
        firstName,
        type,
        lastName,
        email,
        jobType,
        company,
        name: `${firstName} ${lastName}`,
        note: notes,
        phones: map(
          phone => ({ label: phone.type, number: phone.number }),
          phones,
        ),
        prefix,
        tags: map(tag => tag.value, tags),
        roles,
      };
      addPeople(newPeople);
    }}
    render={({
      values,
      isValid,
      errors,
      handleSubmit,
      handleReset,
      setFieldTouched,
      dirty,
      setFieldValue,
      isSubmitting,
    }) => (
      <Container>
        <Header>
          <HeaderLeft>
            <Spacer size={15} />
            <AvatarSelector
              formId="addPeople"
              name={values.firstName}
              lastName={values.lastName}
              handleChangeColor={changeColor}
              setFieldValue={setFieldValue}
            />
            <Spacer />
            <Title title={title} />
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
              onClick={() => {
                if (!dirty) {
                  history.goBack();
                } else {
                  showDialogHandler();
                }
              }}
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
        <PeopleForm id="addCompany" onSubmit={handleSubmit}>
          <StyledFormField
            field={getField('prefix')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('firstName')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('lastName')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('types')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('email')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('jobType')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          {values.types === 'Worker' ? (
            <StyledFormField
              field={getField('company')}
              values={values}
              value="redpelicans"
              disabled={true}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
          ) : (
            <StyledFormField
              field={getField('company')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
          )}
          <StyledFormField
            field={getField('phones')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('tags')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('roles')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('notes')}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
        </PeopleForm>
      </Container>
    )}
  />
);

Form.propTypes = {
  initialValues: PropTypes.object.isRequired,
  changeColor: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  showDialogHandler: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export const FormElem = onlyUpdateForKeys([
  'changeColor',
  'history',
  'showDialogHandler',
])(Form);

const AddPeople = ({
  changeColor,
  history,
  isDialogOpen,
  showDialogHandler,
  addPeople,
}) => {
  const initialValues = {
    ...defaultValues,
  };
  return (
    <div>
      <Dialog isOpen={isDialogOpen} className="pt-dark">
        <div className="pt-dialog-body">
          Would you like to cancel this form?
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button
              onClick={() => showDialogHandler()}
              className="pt-intent-warning pt-large"
            >
              No
            </Button>
            <Button
              onClick={() => history.goBack()}
              className="pt-intent-success pt-large"
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>
      <FormElem
        initialValues={initialValues}
        changeColor={changeColor}
        history={history}
        showDialogHandler={showDialogHandler}
        addPeople={addPeople}
        title="New People"
      />
    </div>
  );
};

AddPeople.propTypes = {
  changeColor: PropTypes.func.isRequired,
  showDialogHandler: PropTypes.func.isRequired,
  history: PropTypes.object,
  isDialogOpen: PropTypes.bool,
  addPeople: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const actions = { addPeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withState('color', 'changeColor', ''),
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
    showDialogHandler: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
  connect(null, mapDispatchToProps),
);

export default enhance(AddPeople);
