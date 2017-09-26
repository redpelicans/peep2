import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose, map } from 'ramda';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import getCities from '../../selectors/cities';
import getCountries from '../../selectors/countries';
import {
  exportedFields,
  defaultValues,
  getValidationSchema,
  getField,
} from '../../forms/companies';
import { getTags } from '../../selectors/tags';
import {
  Spacer,
  Title,
  CompagnyForm,
  Container,
  AvatarSelector,
  FormField,
} from '../widgets';

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.label};
`;

const getFields = (
  cities,
  countries,
  tags,
  values,
  errors,
  handleChange,
  touched,
  isSubmitting,
  setFieldValue,
) =>
  map(
    field => (
      <StyledFormField key={field.key} name={field.key}>
        <field.component
          handleChange={handleChange}
          field={field}
          cities={cities}
          value={values[field.label]}
          countries={countries}
          toucher={touched}
          isSubmitting={isSubmitting}
          setFieldValue={setFieldValue}
          tags={tags}
        />
      </StyledFormField>
    ),
    exportedFields,
  );

const AddCompany = ({ changeColor, cities, countries, tags }) => {
  const initialValues = {
    ...defaultValues,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      isInitialValid={({ validationSchema, initialValues }) =>
        validationSchema.isValid(initialValues)}
      onSubmit={values => console.log('submit!, values:', values)}
      render={({
        values,
        isValid,
        errors,
        touched,
        handleChange,
        handleSubmit,
        handleReset,
        setFieldTouched,
        dirty,
        setFieldValue,
        isSubmitting,
      }) => (
        <Container>
          {console.log('values: ', values)}
          <Header>
            <HeaderLeft>
              <Spacer size={15} />
              <AvatarSelector
                name={values.Name}
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
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <StyledFormField
              field={getField('name')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <StyledFormField
              field={getField('website')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <StyledFormField
              field={getField('street')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <StyledFormField
              field={getField('zipcode')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <StyledFormField
              field={getField('city')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              cities={cities}
            />
            <StyledFormField
              field={getField('country')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              countries={countries}
            />
            <StyledFormField
              field={getField('tags')}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              tags={tags}
            />
            <StyledFormField
              field={getField('notes')}
              values={values}
              errors={errors}
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
  cities: PropTypes.array,
  tags: PropTypes.array,
  countries: PropTypes.array,
};

const mapStateToProps = state => ({
  countries: getCountries(state),
  cities: getCities(state),
  tags: getTags(state),
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withState('color', 'changeColor', ''),
  withHandlers({
    changeColorHandler: ({ changeColor }) => () => changeColor(color => color),
  }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(AddCompany);
