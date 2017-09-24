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
import fields from './forms';
import {
  Spacer,
  Title,
  CompagnyForm,
  Container,
  AvatarSelector,
} from '../widgets';

const StyledFormField = styled.div`grid-area: ${props => props.name};`;

const getFields = (cities, countries, values, errors, handleChange) =>
  map(
    field => (
      <StyledFormField key={field.key} name={field.key}>
        <field.component
          handleChange={handleChange}
          field={field}
          cities={cities}
          value={values[field.label]}
          countries={countries}
        />
      </StyledFormField>
    ),
    fields,
  );

const AddCompany = ({ changeColor, valid, cities, countries }) => {
  const initialValues = {
    Types: '',
    Name: '',
    Website: '',
    Street: '',
    ZipCode: '',
    City: 'Paris',
    Country: '',
    Tags: '',
    Notes: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        let errors = {};
        if (!values.Types) {
          errors.Types = 'Required';
        }
        return errors;
      }}
      onSubmit={() => console.log('submit')}
      render={({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <Container>
          <Header>
            {console.log('values: ', values)}
            <HeaderLeft>
              <Spacer size={20} />
              <AvatarSelector handleChangeColor={changeColor} />
              <Spacer />
              <Title title="New Companie" />
            </HeaderLeft>
            <HeaderRight>
              <Button
                form="addCompany"
                type="submit"
                disabled={!errors}
                className="pt-intent-success pt-large"
              >
                Create
              </Button>
              <Spacer />
              <Link to="/companies">
                <Button className="pt-intent-warning pt-large">Cancel</Button>
              </Link>
              <Spacer size={25} />
            </HeaderRight>
          </Header>
          <CompagnyForm id="addCompany" onSubmit={handleSubmit}>
            {getFields(cities, countries, values, errors, handleChange)}
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
  countries: PropTypes.array,
  companyForm: PropTypes.object,
};

const mapStateToProps = state => ({
  countries: getCountries(state),
  cities: getCities(state),
  companyForm: state.form.addCompany,
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
