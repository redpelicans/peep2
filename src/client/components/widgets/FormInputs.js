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
  & .Select-value-label {
    color: white !important;
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

export class CitySelect extends Component {
  handleChange = value => {
    this.props.setFieldValue('City', value.value);
  };
  render() {
    const getOptions = map(city => ({ value: city, label: city }));
    const { field: { label, required }, cities, value } = this.props;
    return (
      <InputElt>
        <InputText>
          {label}:
          {required && <RequiredStar>*</RequiredStar>}
        </InputText>
        <SelectStyled
          id="City"
          options={getOptions(cities)}
          onChange={this.handleChange}
          value={value}
          name={label}
        />
      </InputElt>
    );
  }
}

CitySelect.propTypes = {
  field: PropTypes.object.isRequired,
  cities: PropTypes.array.isRequired,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
};

export class CountrySelect extends Component {
  handleChange = value => {
    this.props.setFieldValue('Country', value.value);
  };
  render() {
    const getOptions = map(country => ({ value: country, label: country }));
    const { field: { label, required }, countries, value } = this.props;
    return (
      <InputElt>
        <InputText>
          {label}:
          {required && <RequiredStar>*</RequiredStar>}
        </InputText>
        <SelectStyled
          id="City"
          options={getOptions(countries)}
          onChange={this.handleChange}
          value={value}
          name={label}
        />
      </InputElt>
    );
  }
}

CountrySelect.propTypes = {
  field: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
};

export class TypeSelect extends Component {
  handleChange = value => {
    this.props.setFieldValue('Types', value.value);
  };
  render() {
    const getOptions = map(type => ({ value: type, label: type }));
    const { field: { label, required, domainValues = [] }, value } = this.props;
    return (
      <InputElt>
        <InputText>
          {label}:
          {required && <RequiredStar>*</RequiredStar>}
        </InputText>
        <SelectStyled
          id="City"
          options={getOptions(domainValues)}
          onChange={this.handleChange}
          value={value}
          name={label}
        />
      </InputElt>
    );
  }
}

TypeSelect.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
  domainValues: PropTypes.array,
};

export class TagsSelect extends Component {
  handleChange = value => {
    this.props.setFieldValue('Tags', value);
  };
  render() {
    const getOptions = map(tag => ({ value: tag, label: tag }));
    const { field: { label, required }, value, tags } = this.props;
    return (
      <InputElt>
        <InputText>
          {label}:
          {required && <RequiredStar>*</RequiredStar>}
        </InputText>
        <SelectStyled
          id="Tags"
          multi={true}
          options={getOptions(tags)}
          onChange={this.handleChange}
          value={value}
          name={label}
        />
      </InputElt>
    );
  }
}

TagsSelect.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array,
  setFieldValue: PropTypes.func,
  tags: PropTypes.array,
};
