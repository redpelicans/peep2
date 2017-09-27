import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field } from '../fields';

const ButtonStyled = styled.button`
  width: 36px;
  height: 36px;
  margin-left: 10px;
`;

const PhoneFieldContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InputStyled = styled.input`min-width: 300px;`;

class PhoneField extends Component {
  state = {
    values: [],
    selectedType: 'mobile',
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
    const handleChangeSelectedType = e => {
      console.log('selected type event: ', e);
    };
    const { values, selectedType } = this.state;
    return (
      <Field label={label} error={error} required={required}>
        <PhoneFieldContainer>
          <div className="pt-control-group">
            <div className="pt-input-group">
              <span className="pt-icon pt-icon-phone" />
              <InputStyled
                type="text"
                className="pt-input"
                placeholder="Add phone number"
              />
              <div className="pt-input-action">
                <button
                  onChange={this.handleChangeSelectedType}
                  className="pt-button pt-minimal pt-intent-primary"
                >
                  type<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
                </button>
              </div>
            </div>
            <button className="pt-button">
              <span className="pt-icon-standard pt-icon-plus" />
            </button>
          </div>
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
