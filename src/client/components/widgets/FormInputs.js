import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';

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
  width:85px;
  margin-left:10px;
  color:${Colors.RED3};
`;

const InputField = styled.input`
  margin-top:20px;
  border:0;
  height:25px;
  border-radius:2px;
  padding:7px;
`;

const InputText = styled.label`
  display: flex;
  margin:0;
`;

const TextAreaElt = styled.textarea`
  margin-top:20px;
`;

const SelectElt = styled.div`
  margin-top:20px;
`;

const SelectInputElt = styled.select`
  width:100%;
`;

const RequiredStar = styled.span`
  color:${Colors.RED3};
  margin-left:5px;
`;

export const TextInput = ({
  field: { label, type, required },
  input,
  meta: { touched, error },
}) =>
  (<InputElt>
    <InputText>
      {label}
      {required && <RequiredStar>*</RequiredStar>}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <InputField {...input} type={type} className="pt-input" />
  </InputElt>);

TextInput.propTypes = {
  field: PropTypes.object,
  input: PropTypes.node,
  meta: PropTypes.object,
};

export const TextAreaInput = ({
  field: { label, required },
  meta: { touched, error },
}) => (
  <InputElt>
    <InputText>
      {label}
      {required && <RequiredStar>*</RequiredStar>}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <TextAreaElt className="pt-input" dir="auto" />
  </InputElt>
);

TextAreaInput.propTypes = {
  field: PropTypes.object,
  meta: PropTypes.object,
};

export const SelectInput = ({
  field,
  input,
  meta: { touched, error },
  cities,
  countries,
}) =>
  (<InputElt>
    <InputText>
      {field.label}
      {field.required && <RequiredStar>*</RequiredStar>}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <SelectElt className="pt-select">
      <SelectInputElt {...input} >
        <option selected>Choose an item...</option>
        {field.label === 'Types' && field.domainValues.map(type => (<option key={type} value={type}>{type}</option>))}
        {field.label === 'City' && cities.map(city => (<option key={city} value={city}>{city}</option>))}
        {field.label === 'Country' && countries.map(country => (<option key={country} value={country}>{country}</option>))}
      </SelectInputElt>
    </SelectElt>
  </InputElt>);

SelectInput.propTypes = {
  field: PropTypes.object,
  input: PropTypes.node,
  meta: PropTypes.object,
  countries: PropTypes.array,
  cities: PropTypes.array,
};
