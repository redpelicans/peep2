import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withState, withHandlers } from 'recompose';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose, map } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import getCities from '../../selectors/cities';
import getCountries from '../../selectors/countries';
import fields from './forms';
import { Spacer, InputRow, TextInput, TextAreaInput, SelectInput, Title, Form, Container, AvatarSelector } from '../widgets';

const validate = values => {
  const errors = {};
  map(field => {
    if (field.required === true && !values[field.label]) {
      errors[field.label] = 'Required';
    }
  }, fields);
  return errors;
};

const getInputComponent = type => {
  if (type === 'input') {
    return TextInput;
  } else if (type === 'textarea') {
    return TextAreaInput;
  } else if (type === 'select') {
    return SelectInput;
  }
};

const getFields = (cities, countries) =>
  map(
    field => (
      <InputRow key={field.key}>
        <Field component={getInputComponent(field.type)} name={field.key} field={field} cities={cities} countries={countries} />
      </InputRow>
    ),
    fields,
  );

const AddCompanie = ({ changeColor, valid, cities, countries, companieForm: { values = {} } }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <Spacer size={20} />
        <AvatarSelector name={values.Name ? values.Name : ''} handleChangeColor={changeColor} />
        <Spacer />
        <Title title="New Companie" />
      </HeaderLeft>
      <HeaderRight>
        <Button form="companie" type="submit" disabled={!valid} className="pt-intent-success">
          Create
        </Button>
        <Spacer />
        <Link to="/companies">
          <Button className="pt-intent-warning">Cancel</Button>
        </Link>
        <Spacer size={25} />
      </HeaderRight>
    </Header>
    <Form id="companie">{getFields(cities, countries)}</Form>
  </Container>
);

AddCompanie.propTypes = {
  changeColor: PropTypes.func.isRequired,
  valid: PropTypes.bool,
  cities: PropTypes.array,
  countries: PropTypes.array,
  companieForm: PropTypes.object,
};

const mapStateToProps = state => ({
  countries: getCountries(state),
  cities: getCities(state),
  companieForm: state.form.companie,
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withState('color', 'changeColor', ''),
  withHandlers({ changeColorHandler: ({ changeColor }) => () => changeColor(color => color) }),
  reduxForm({
    form: 'companie',
    validate,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(AddCompanie);
