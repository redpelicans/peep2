import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';
import { map } from 'ramda';
import 'react-select/dist/react-select.css';
import { Colors } from '@blueprintjs/core';

const InputElt = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 15px;
  padding-right: 10px;
`;

const InputField = styled.input`
  margin-top: 20px;
  border: 0;
  height: 35px;
  border-radius: 2px;
  padding: 7px;
`;

const InputText = styled.label`
  display: flex;
  margin: 0;
`;

const TextAreaElt = styled.textarea`margin-top: 20px;`;

const RequiredStar = styled.span`
  color: ${Colors.RED3};
  margin-left: 5px;
`;

const SelectStyled = styled(Select.Creatable)`
  margin-top: 20px;
  &.Select--multi {
    .Select-value {
      display: inline-flex;
      align-items: center;
      color: ${Colors.WHITE};
      background-color: ${Colors.DARK_GRAY4};
    }
  }
  & .is-searchable.is-open > .Select-control {
    background-color: ${Colors.DARK_GRAY4};
  }
  & .Select-control {
    border-radius: 2px;
    border: 1px solid ${Colors.DARK_GRAY3};
    background-color: ${Colors.DARK_GRAY4};
    color: ${Colors.WHITE};
  }
  & .is-open > .Select-value {
    background-color: red !important;
  }
  & .Select-clear-zone:hover {
    color: ${Colors.RED3};
  }
  & .Select-value-label {
    color: white !important;
  }
  & .Select-menu-outer {
    border: 0;
    background-color: ${Colors.DARK_GRAY5};
  }
  & .Select-option {
    box-sizing: none;
    background-color: ${Colors.DARK_GRAY4};
    color: ${Colors.LIGHT_GRAY4};
  }
  & .Select-placeholder {
    font-size: smaller;
    color: ${Colors.WHITE};
    background-color: ${Colors.DARK_GRAY4};
    border: 0;
  }
`;

export const FormField = ({ field, values, errors, className, ...props }) => {
  const newProps =
    'domainValues' in field
      ? { ...props, domainValues: field.domainValues }
      : props;
  return (
    <div className={className}>
      <field.component
        name={field.name}
        label={'label' in props ? props.label : field.label}
        value={'value' in props ? props.value : values[field.name]}
        error={errors && errors[field.name]}
        required={!!field.required}
        {...newProps}
      />
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.node,
  values: PropTypes.object,
  errors: PropTypes.object,
  label: PropTypes.string,
  handleChange: PropTypes.func,
  className: PropTypes.string,
};

export const TextInput = ({
  name,
  label,
  required,
  value,
  setFieldTouched,
  setFieldValue,
}) => {
  const handleChange = e => {
    const newValue = e.target.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  return (
    <InputElt>
      <InputText>
        {label}:
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <InputField
        onChange={handleChange}
        type="text"
        name={label}
        className="pt-input"
        value={value}
      />
    </InputElt>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export const TextAreaInput = ({
  label,
  name,
  required,
  value,
  setFieldTouched,
  setFieldValue,
}) => {
  const handleChange = e => {
    const newValue = e.target.value;
    setFieldTouched(name, newValue !== value);
    setFieldValue(name, newValue);
  };
  return (
    <InputElt>
      <InputText>
        {label}:
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <TextAreaElt
        name={label}
        className="pt-input"
        onChange={handleChange}
        dir="auto"
        value={value}
      />
    </InputElt>
  );
};

TextAreaInput.propTypes = {
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
};
