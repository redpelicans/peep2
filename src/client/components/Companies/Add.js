import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose } from 'ramda';
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
  grid-template-areas: 'Types' 'Name' 'Website' 'Zipcode' 'Street' 'Country'
    'City' 'Tags' 'Note';
  @media (min-width: 700px) {
    grid-template-areas: 'Types Name Website' 'Zipcode Street Street'
      'Country City City' 'Tags Tags Tags' 'Note Note Note';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.label};
`;

const AddCompany = ({ changeColor }) => {
  const initialValues = { ...defaultValues };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={values => console.log('submit!, values:', values)}
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
                name={values.name}
                handleChangeColor={changeColor}
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
              <Link to="/companies">
                <Button className="pt-intent-warning pt-large">Cancel</Button>
              </Link>
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
              field={getField('types')}
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
};

AddCompany.propTypes = {
  changeColor: PropTypes.func.isRequired,
};

const enhance = compose(
  withState('color', 'changeColor', ''),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
  }),
);

export default enhance(AddCompany);
