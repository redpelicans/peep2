import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose, map } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import getCities from '../../selectors/cities';
import getCountries from '../../selectors/countries';
import fields from './forms';
import { AvatarSelector, TextInput, TextAreaInput, SelectInput } from '../widgets';

const Container = styled.div`
  display:flex;
  align-items: center;
  flex-direction:column;
  position:relative;
  min-width:300px;
  padding: 20px;
  margin:25px;
  padding-bottom:50px;
  background-color: #394b59;
  border-radius: 2px;
`;

const Header = styled.div`
  display: flex;
  padding-top:25px;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: center;
  width:90%;
`;

const Buttons = styled.div`
  display:flex;
  justify-content: flex-end;
  align-items: center;
  flex:1;
`;

const ButtonElt = styled(Button)`
  height:30px;
  margin-left:15px;
  margin-right:15px;
`;

const TitleRow = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  margin-bottom:25px;
`;

const Title = styled.h3`
  color:white;
  margin:0;
  margin-left:25px;
`;

const Form = styled.form`
  display:flex;
  flex-direction:column;
  margin-top:25px;
  width:90%;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top:10px;
  width:100%;
`;

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

const getFields = (cities, countries) => map((field) => (
  <InputRow key={field.key}>
    <Field
      component={getInputComponent(field.type)}
      name={field.key}
      field={field}
      cities={cities}
      countries={countries}
    />
  </InputRow>
), fields);

class AddCompanie extends Component {
  state = {
    color: '',
  }
  handleSubmit = (e) => {
    console.log('submit: ', e);
  }

  handleChangeColor = color => {
    this.setState({ color });
  }

  render() {
    const { handleSubmit, valid, cities, countries, companieForm: { values = {} } } = this.props;
    return (
      <Container>
        <Header>
          <TitleRow>
            <AvatarSelector handleChangeColor={this.handleChangeColor} name={values.Name} />
            <Title>New Companie</Title>
          </TitleRow>
          <Buttons>
            <ButtonElt form="companie" type="submit" disabled={!valid} className="pt-intent-success">Create</ButtonElt>
            <Link to="/companies">
              <ButtonElt className="pt-intent-warning">Cancel</ButtonElt>
            </Link>
          </Buttons>
        </Header>
        <Form id="companie" onSubmit={handleSubmit(this.handleSubmit)}>
          {getFields(cities, countries)}
        </Form>
      </Container>
    );
  }
}

AddCompanie.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  companieForm: PropTypes.object,
  countries: PropTypes.array,
  cities: PropTypes.array,
  valid: PropTypes.bool,
};


const mapStateToProps = state => ({
  countries: getCountries(state),
  cities: getCities(state),
  companieForm: state.form.companie,
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default compose(reduxForm({
  form: 'companie',
  validate,
}), connect(mapStateToProps, mapDispatchToProps))(AddCompanie);
