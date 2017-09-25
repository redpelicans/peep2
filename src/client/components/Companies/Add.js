import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose, map, isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Formik } from 'formik';
import getCities from '../../selectors/cities';
import getCountries from '../../selectors/countries';
import fields, { defaultValues } from '../../forms/companies';
import { getTags } from '../../selectors/tags';
import {
  Spacer,
  Title,
  CompagnyForm,
  Container,
  AvatarSelector,
} from '../widgets';

const StyledFormField = styled.div`grid-area: ${props => props.name};`;

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
    fields,
  );

const AddCompany = ({ changeColor, cities, countries, tags }) => {
  const initialValues = {
    ...defaultValues,
  };
  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        let errors = {};
        if (!values.Types) {
          errors.Types = 'Required';
        } else if (!values.Name) {
          errors.Name = 'Required';
        } else if (!values.Website) {
          errors.Website = 'Required';
        } else if (!values.ZipCode) {
          errors.ZipCode = 'Required';
        } else if (!values.Street) {
          errors.Street = 'Required';
        } else if (!values.Country) {
          errors.Country = 'Required';
        } else if (!values.City) {
          errors.City = 'Required';
        }
        return errors;
      }}
      onSubmit={values => console.log('submit!, values:', values)}
      render={({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <Container>
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
                disabled={!isEmpty(errors) || isEmpty(values)}
                className="pt-intent-success pt-large"
              >
                Create
              </Button>
              <Spacer />
              <Link to="/companies">
                <Button className="pt-intent-warning pt-large">Cancel</Button>
              </Link>
              <Spacer size={20} />
            </HeaderRight>
          </Header>
          <CompagnyForm id="addCompany" onSubmit={handleSubmit}>
            {getFields(
              cities,
              countries,
              tags,
              values,
              errors,
              handleChange,
              touched,
              isSubmitting,
              setFieldValue,
            )}
          </CompagnyForm>
        </Container>
      )}
    />
  );
};

AddCompany.propTypes = {
  changeColor: PropTypes.func.isRequired,
  valid: PropTypes.bool,
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
