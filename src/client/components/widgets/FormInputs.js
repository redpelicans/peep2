import React from 'react';
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
      border: 1px solid red;
      display: inline-flex;
      align-items: center;
    }
  }

  & .Select-placeholder {
    font-size: smaller;
    color: ${Colors.WHITE};
    background-color: ${Colors.DARK_GRAY4};
    border: none;
  }
`;

export const TextInput = ({
  field: { label, required },
  value,
  handleChange,
}) => (
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

TextInput.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export const TextAreaInput = ({
  field: { label, required },
  value,
  handleChange,
}) => (
  <InputElt>
    <InputText>
      {label}:
      {required && <RequiredStar>*</RequiredStar>}
    </InputText>
    <TextAreaElt
      onChange={handleChange}
      name={label}
      className="pt-input"
      dir="auto"
      value={value}
    />
  </InputElt>
);

TextAreaInput.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export const CitySelect = ({ field: { label, required }, cities, value }) => {
  const getOptions = map(city => ({ value: city, label: city }));

  return (
    <InputElt>
      <InputText>
        {label}:
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled name={label} value={value} options={getOptions(cities)} />
    </InputElt>
  );
};

CitySelect.propTypes = {
  field: PropTypes.object.isRequired,
  cities: PropTypes.array.isRequired,
  value: PropTypes.string,
};

export const CountrySelect = ({ field: { label, required }, countries }) => {
  const getOptions = map(country => ({ value: country, label: country }));
  return (
    <InputElt>
      <InputText>
        {label}:
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled name="city" options={getOptions(countries)} />
    </InputElt>
  );
};

CountrySelect.propTypes = {
  field: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
};

export const TypeSelect = ({
  field: { label, required, domainValues = [] },
}) => {
  const getOptions = map(type => ({ value: type, label: type }));
  return (
    <InputElt>
      <InputText>
        {label}:
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled name="Types" options={getOptions(domainValues)} />
    </InputElt>
  );
};

TypeSelect.propTypes = {
  field: PropTypes.object.isRequired,
  domainValues: PropTypes.array,
};
