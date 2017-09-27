import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from '../fields';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const Buttons = styled.div`
  right: 0;
  align-self: flex-end;
  margin-bottom: 15px;
`;

export class MarkDownField extends Component {
  state = {
    displayTextArea: true,
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
    const { displayTextArea } = this.state;
    const handleChange = e => {
      const newValue = e.target.value;
      setFieldTouched(name, newValue !== value);
      setFieldValue(name, newValue);
    };
    const handleDisplayText = () => {
      this.setState({ displayTextArea: true });
    };
    const handleDisplayMark = () => {
      this.setState({ displayTextArea: false });
    };

    return (
      <Field label={label} error={error} required={required}>
        <Buttons className="pt-button-group">
          <button
            type="button"
            className="pt-button"
            onClick={handleDisplayText}
          >
            Edit
          </button>
          <button
            type="button"
            className="pt-button"
            onClick={handleDisplayMark}
          >
            View
          </button>
        </Buttons>
        {displayTextArea && (
          <textarea
            name={name}
            className="pt-input pt-fill"
            value={value}
            onChange={handleChange}
            dir="auto"
            {...props}
          />
        )}
        {!displayTextArea && <ReactMarkdown source={value} />}
      </Field>
    );
  }
}

MarkDownField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export default MarkDownField;
