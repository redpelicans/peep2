import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { AvatarSelector, textArea, renderField, renderSelect } from '../widgets';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-width: 300px;
  padding: 20px;
  margin: 25px;
  padding-bottom: 50px;
  background-color: #394b59;
  border-radius: 2px;
`;

const Header = styled.div`
  display: flex;
  padding-top: 25px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 90%;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;

const ButtonElt = styled(Button)`
  height: 30px;
  margin-left: 15px;
  margin-right: 15px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  color: white;
  margin: 0;
  margin-left: 25px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  width: 90%;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  width: 100%;
`;

const validate = values => {
  const errors = {};
  if (!values.Name) {
    errors.Name = 'Required';
  }
  if (!values.Website) {
    errors.Website = 'Required';
  }
  if (!values.City) {
    errors.City = 'Required';
  }
  if (!values.Country) {
    errors.Country = 'Required';
  }
  return errors;
};

class AddCompanie extends Component {
  state = {
    color: '',
  };
  handleSubmit = e => {
    console.log('submit: ', e); // eslint-disable-line no-console
  };

  handleChangeColor = color => {
    this.setState({ color });
  };

  render() {
    const { handleSubmit, valid, companieForm: { values = {} } } = this.props;
    return (
      <Container>
        <Header>
          <TitleRow>
            <AvatarSelector handleChangeColor={this.handleChangeColor} name={values.Name} />
            <Title>New Companie</Title>
          </TitleRow>
          <Buttons>
            <ButtonElt form="companie" type="submit" disabled={!valid} className="pt-intent-success">
              Create
            </ButtonElt>
            <Link to="/companies">
              <ButtonElt className="pt-intent-warning">Cancel</ButtonElt>
            </Link>
          </Buttons>
        </Header>
        <Form id="companie" onSubmit={handleSubmit(this.handleSubmit)}>
          <InputRow>
            <Field name="Type" component={renderField} type="text" label="Type :" className="pt-input pt-dark" />
            <Field name="Name" component={renderField} type="text" label="Name :" className="pt-input pt-dark" />
            <Field name="Website" component={renderField} type="text" label="Website :" className="pt-input pt-dark" />
          </InputRow>
          <InputRow>
            <Field name="Street" component={renderField} type="text" label="Street :" className="pt-input pt-dark" />
            <Field name="Zip Code" component={renderField} type="text" label="Zip Code :" className="pt-input pt-dark" />
          </InputRow>
          <InputRow>
            <Field name="City" component={renderSelect} label="City :" className="pt-input pt-dark" />
            <Field name="Country" component={renderField} type="text" label="Country :" className="pt-input pt-dark" />
          </InputRow>
          <InputRow>
            <Field name="Tags" component={renderField} type="text" label="Tags :" className="pt-input pt-dark" />
          </InputRow>
          <InputRow>
            <Field name="Note" component={textArea} label="Note :" />
          </InputRow>
        </Form>
      </Container>
    );
  }
}

AddCompanie.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  companieForm: PropTypes.object,
  valid: PropTypes.bool,
};

const mapStateToProps = state => ({
  countries: state.countries.data,
  companieForm: state.form.companie,
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default compose(
  reduxForm({
    form: 'companie',
    validate,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(AddCompanie);
