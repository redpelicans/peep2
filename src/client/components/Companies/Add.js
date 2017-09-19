import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button, Colors } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
// import { compose, join, map, take, split } from 'ramda';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { randomColor } from '../../utils/colors';

const Container = styled.div`
  display:flex;
  flex-direction:column;
  position:relative;
  min-width:300px;
  padding: 20px;
  margin:25px;
  background-color: #394b59;
  border-radius: 2px;
`;

const Header = styled.div`
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: center;
  width:100%;
`;

const Buttons = styled.div`
  display:flex;
`;

const ButtonElt = styled(Button)`
  height:30px;
  margin-left:15px;
  margin-right:15px;
`;

const FakeAvatar = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  font-size:2em;
  min-width:50px;
  min-height:50px;
  border-radius:100px;
  background-color: ${props => props.color};
`;

const TitleRow = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
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
  width:100%;
`;

const ColorSelector = styled.div`
  margin-bottom:15px;
  margin-top:15px;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width:100%;
`;

const InputElt = styled.div`
  display: flex;
  flex-direction:column;
  flex:1;
  margin-top:15px;
  padding-right:10px;
`;

const Error = styled.span`
  display:flex;
  justify-content: space-between;
  width:100px;
  color:${Colors.RED3};
  margin-top:10px;
`;

const InputField = styled.input`
  margin-top:20px;
  margin-right:20px;
  box-shadow: 0 0 0 0 rgba(19, 124, 189, 0),
  0 0 0 0 rgba(19, 124, 189, 0),
  0 0 0 0 rgba(19, 124, 189, 0),
  inset 0 0 0 1px rgba(16, 22, 26, 0.3),
  inset 0 1px 1px rgba(16, 22, 26, 0.4);
  background: rgba(16, 22, 26, 0.3);
  color: #f5f8fa;
  border:0;
  height:25px;
  border-radius:2px;
  padding:7px;
`;

const InputText = styled.label`
  margin:0;
`;

// const initials = compose(join(''), map(take(1)), take(3), split(' '));

const validate = values => {
  const errors = {};
  if (!values.Name) {
    errors.Name = 'Required';
  } if (!values.Website) {
    errors.Website = 'Required';
  } if (!values.City) {
    errors.City = 'Required';
  } if (!values.Country) {
    errors.Country = 'Required';
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}) =>
  (<InputElt>
    <InputText>
      {label}
    </InputText>
    <InputField {...input} type={type} />
    {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
  </InputElt>);

renderField.propTypes = {
  input: PropTypes.node,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

class AddCompanie extends Component {
  state = {
    selectedColor: randomColor(),
  }
  handleSubmit = (e) => {
    console.log('ca submit: ', e);
  }
  render() {
    const { selectedColor } = this.state;
    const { handleSubmit, submitting } = this.props;
    console.log('props: ', this.props);
    return (
      <Container>
        <Header>
          <TitleRow>
            <FakeAvatar color={selectedColor}>
              {}
            </FakeAvatar>
            <Title>New Companie</Title>
          </TitleRow>
          <Buttons>
            <ButtonElt form="companie" type="submit" disabled={submitting} className="pt-intent-success">Create</ButtonElt>
            <Link to="/companies">
              <ButtonElt className="pt-intent-warning">Cancel</ButtonElt>
            </Link>
          </Buttons>
        </Header>
        <Form id="companie" onSubmit={handleSubmit(this.handleSubmit)}>
          <ColorSelector className="pt-select">
            <select>
              <option selected>Choose a color...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </ColorSelector>
          <InputRow>
            <Field name="Name" component={renderField} type="text" label="Name :" />
            <Field name="Website" component={renderField} type="text" label="Website :" />
          </InputRow>
          <InputRow>
            <Field name="City" component={renderField} type="text" label="City :" />
            <Field name="Country" component={renderField} type="text" label="Country :" />
          </InputRow>
          <InputRow>
            <Field name="Tags" component={renderField} type="text" label="Tags :" />
          </InputRow>
          <InputRow>
            <Field name="Note" component={renderField} type="text" label="Note :" />
          </InputRow>
        </Form>
      </Container>
    );
  }
}

AddCompanie.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};


const mapStateToProps = state => ({
  countries: state.countries.data,
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default compose(reduxForm({
  form: 'companie',
  validate,
}), connect(mapStateToProps, mapDispatchToProps))(AddCompanie);
