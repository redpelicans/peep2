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

const InputSelect = styled.select`
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

export const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
  className,
}) =>
  (<InputElt>
    <InputText>
      {label}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <InputField {...input} type={type} className={className} />
  </InputElt>);

renderField.propTypes = {
  input: PropTypes.node,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string,
};

export const textArea = ({
  label,
  meta: { touched, error },
}) => (
  <InputElt>
    <InputText>
      {label}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <TextAreaElt className="pt-input" dir="auto" />
  </InputElt>
);

textArea.propTypes = {
  label: PropTypes.string,
  meta: PropTypes.object,
};

export const renderSelect = ({
  input,
  label,
  meta: { touched, error },
  className,
}) =>
  (<InputElt>
    <InputText>
      {label}
      {touched &&
      ((error &&
        <Error className="pt-icon-standard pt-icon-warning-sign">
          {error}
        </Error>))}
    </InputText>
    <InputSelect {...input} className={className} />
  </InputElt>);

renderSelect.propTypes = {
  input: PropTypes.node,
  label: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string,
};
