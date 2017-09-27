import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field } from '../fields';
import { InputField } from './index';

const ButtonStyled = styled.button`
  width: 36px;
  height: 36px;
  margin-left: 10px;
`;

const PhoneFieldContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputStyled = styled.input`height: 36px;`;

class PhoneField extends Component {
  state = {
    valueNumber: 1,
  };
  handleAddValue = () => {
    this.setState({ valueNumber: this.state.valueNumber + 1 });
  };
  render() {
    const {
      name,
      label,
      error,
      required,
      value = '',
      setFieldTouched,
      setFieldValue,
      ...props
    } = this.props;
    const handleChange = e => {
      const newValue = e.target.value;
      setFieldTouched(name, newValue !== value);
      setFieldValue(name, newValue);
    };
    return (
      <Field label={label} error={error} required={required}>
        <PhoneFieldContainer>
          <InputStyled
            name={name}
            className="pt-input pt-fill"
            value={value}
            dir="auto"
            onChange={handleChange}
            {...props}
          />
          <ButtonStyled
            type="button"
            onClick={this.handleAddValue}
            className="pt-button pt-icon-plus"
          />
        </PhoneFieldContainer>
      </Field>
    );
  }
}

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export default PhoneField;
