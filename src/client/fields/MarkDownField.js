import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, RequiredTag } from '../fields';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Spacer } from '../components/widgets';

const Buttons = styled.div`
  right: 0;
  align-self: flex-end;
  margin-bottom: 15px;
`;

const TextAreaStyled = styled.textarea`
  min-height: 150px;
  min-width: 100%;
`;

const MarkDownLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
      <Field error={error} required={required}>
        <div>
          <MarkDownLabel>
            <label className="pt-label">
              {label}
              <RequiredTag required={required} />
            </label>
            <Spacer />
            <Buttons className="pt-button-group pt-minimal">
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
          </MarkDownLabel>
          {displayTextArea && (
            <TextAreaStyled
              name={name}
              className="pt-input pt-fill"
              value={value}
              onChange={handleChange}
              dir="auto"
              {...props}
            />
          )}
          {!displayTextArea && <ReactMarkdown source={value} />}
        </div>
      </Field>
    );
  }
}

MarkDownField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export default MarkDownField;
