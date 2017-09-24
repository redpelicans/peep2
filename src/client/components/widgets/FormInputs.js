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
  height: 25px;
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

const SelectStyled = styled(Select.Creatable)`margin-top: 25px;`;

export const TextInput = ({ field: { label, required }, input }) => (
  <InputElt>
    <InputText>
      {label}
      {required && <RequiredStar>*</RequiredStar>}
    </InputText>
    <InputField {...input} type="text" className="pt-input" />
  </InputElt>
);

TextInput.propTypes = {
  field: PropTypes.object,
  input: PropTypes.node,
};

export const TextAreaInput = ({ field: { label, required }, input }) => (
  <InputElt>
    <InputText>
      {label}
      {required && <RequiredStar>*</RequiredStar>}
    </InputText>
    <TextAreaElt {...input} className="pt-input" dir="auto" />
  </InputElt>
);

TextAreaInput.propTypes = {
  field: PropTypes.object,
  input: PropTypes.node,
};

export const CitySelect = ({ field: { label, required }, cities, input }) => {
  const getOptions = map(city => ({ value: city, label: city }));

  return (
    <InputElt>
      {console.log(cities)}
      <InputText>
        {label}
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled {...input} name="city" onBlur={() => input.onBlur(input.value)} options={getOptions(cities)} />
    </InputElt>
  );
};

CitySelect.propTypes = {
  field: PropTypes.object,
  cities: PropTypes.array.isRequired,
  input: PropTypes.node,
};

export const CountrySelect = ({ field: { label, required }, countries, input }) => {
  const getOptions = map(country => ({ value: country, label: country }));
  return (
    <InputElt>
      <InputText>
        {label}
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled {...input} name="city" onBlur={() => input.onBlur(input.value)} options={getOptions(countries)} />
    </InputElt>
  );
};

CountrySelect.propTypes = {
  field: PropTypes.object,
  countries: PropTypes.array.isRequired,
  input: PropTypes.node,
};

export const TypeSelect = ({ field: { label, required, domainValues }, input }) => {
  const getOptions = map(type => ({ value: type, label: type }));
  return (
    <InputElt>
      <InputText>
        {label}
        {required && <RequiredStar>*</RequiredStar>}
      </InputText>
      <SelectStyled {...input} name="Types" onBlur={() => input.onBlur(input.value)} options={getOptions(domainValues)} />
    </InputElt>
  );
};

TypeSelect.propTypes = {
  field: PropTypes.object,
  domainValues: PropTypes.array.isRequired,
  input: PropTypes.node,
};
