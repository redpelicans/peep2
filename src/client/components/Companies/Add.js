import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button, Dialog } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCompany } from '../../actions/companies';
import { compose, map } from 'ramda';
import { onlyUpdateForKeys } from 'recompose';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import {
  defaultValues,
  getValidationSchema,
  getField,
} from '../../forms/companies';
import { Spacer, Title, Container, AvatarSelector } from '../widgets';
import { FormField } from '../../fields';

const CompagnyForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'Type' 'Name' 'Website' 'Zipcode' 'Street' 'Country'
    'City' 'Tags' 'Note';
  @media (min-width: 700px) {
    grid-template-areas: 'Type Name Website' 'Zipcode Street Street'
      'Country City City' 'Tags Tags Tags' 'Note Note Note';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.label};
`;

const Form = ({ initialValues, history, showDialogHandler, addCompany }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={getValidationSchema()}
    isInitialValid={({ validationSchema, initialValues }) =>
      validationSchema.isValid(initialValues)}
    onSubmit={({
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
    }) => {
      const newCompany = {
        name,
        avatar: { color },
        type,
        tags: map(tag => tag.value, tags),
        website,
        address: { street, city, zipcode, country },
        notes,
      };
      addCompany(newCompany);
    }}
    render={({
      values,
      isValid,
      errors,
      touched,
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
              formId="addCompany"
              name={values.name}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <Spacer />
            <Title title="New Companie" />
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
        <CompagnyForm id="addCompany" onSubmit={handleSubmit}>
          <StyledFormField
            field={getField('type')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('name')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('website')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('street')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('zipcode')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('city')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('country')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('tags')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <StyledFormField
            field={getField('notes')}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
        </CompagnyForm>
      </Container>
    )}
  />
);

Form.propTypes = {
  initialValues: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  showDialogHandler: PropTypes.func.isRequired,
  addCompany: PropTypes.func.isRequired,
};

const FormElem = onlyUpdateForKeys([
  'changeColor',
  'color',
  'history',
  'showDialogHandler',
])(Form);

const AddCompany = ({
  addCompany,
  history,
  isDialogOpen,
  showDialogHandler,
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
        history={history}
        showDialogHandler={showDialogHandler}
        addCompany={addCompany}
      />
    </div>
  );
};

AddCompany.propTypes = {
  addCompany: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool,
  showDialogHandler: PropTypes.func.isRequired,
  history: PropTypes.object,
};

const actions = { addCompany };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const enhance = compose(
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    showDialogHandler: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
  connect(null, mapDispatchToProps),
);

export default enhance(AddCompany);
