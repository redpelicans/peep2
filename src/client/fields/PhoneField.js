import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import { Colors } from '@blueprintjs/core';
import { Field } from '../fields';

const PhoneFieldContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 55px;
  margin-bottom: 25px;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const PhoneNumberContainer = styled.div`
  display: flex;
  background-color: ${Colors.DARK_GRAY4};
  min-height: 26px;
  border-radius: 4px;
  width: 100%;
  flex-wrap: wrap;
  padding-bottom: 10px;
`;
const PhoneNumber = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 250px;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
  background-color: ${Colors.DARK_GRAY5};
  border-radius: 4px;
  padding: 10px;
  margin-left: 10px;
  margin-right: 0px;
`;

const InputGroup = styled.div`min-width: 100%;`;

const DeleteButton = styled.span`
  cursor: pointer;
  color: ${Colors.RED5};
`;

const PhoneNumberText = styled.p`margin: 0;`;

const InputStyled = styled.input`
  margin-top: -1px;
  min-width: 200px;
  min-height: 31.5px;
`;

class PhoneField extends Component {
  state = {
    values: [],
    number: '',
    selectedType: 'mobile',
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
    } = this.props;
    const handleChangeValue = e => {
      this.setState({ number: e.target.value });
    };
    const handleChangeSelectedType = e => {
      this.setState({ selectedType: e.target.value });
    };
    const handleAddValue = () => {
      if (isEmpty(number)) {
        return;
      }
      this.setState(
        {
          values: [...values, { type: selectedType, number: number }],
          number: '',
        },
        () => {
          const newValue = this.state.values;
          setFieldTouched(name, newValue !== value);
          setFieldValue(name, newValue);
        },
      );
    };
    const handleDeletePhone = id => {
      const newValues = values.filter(value => value !== values[id]);
      this.setState({ values: newValues });
    };
    const phoneTypes = ['Mobile', 'Home', 'Work'];
    const { values, selectedType, number } = this.state;
    return (
      <Field label={label} error={error} required={required}>
        <Container>
          <PhoneFieldContainer>
            <div className="pt-control-group">
              <InputGroup className="pt-input-group">
                <span className="pt-icon pt-icon-phone" />
                <InputStyled
                  onChange={handleChangeValue}
                  type="text"
                  className="pt-input"
                  placeholder="Add phone number"
                  value={number}
                />
                <div className="pt-input-action">
                  <div className="pt-select">
                    <select onChange={handleChangeSelectedType}>
                      {phoneTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </InputGroup>
              <button onClick={handleAddValue} className="pt-button">
                Add
              </button>
            </div>
          </PhoneFieldContainer>
          <PhoneNumberContainer>
            {values.map((value, index) => (
              <PhoneNumber key={index}>
                <PhoneNumberText>{value.type}:</PhoneNumberText>
                <PhoneNumberText>{value.number}</PhoneNumberText>
                <DeleteButton
                  className="pt-icon-standard pt-icon-cross"
                  onClick={() => handleDeletePhone(index)}
                />
              </PhoneNumber>
            ))}
          </PhoneNumberContainer>
        </Container>
      </Field>
    );
  }
}

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.array,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export default PhoneField;
