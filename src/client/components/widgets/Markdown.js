import React from 'react';
import PropTypes from 'prop-types';
import Remarkable from 'remarkable';
import styled from 'styled-components';
import { Switch, Input } from '@blueprintjs/core';
import { themeColors } from '../../utils/colors';

const convertor = new Remarkable('full');

const StyledMarkdown = styled.div`
  ol,
  ul {
    list-style: circle;
    margin-left: 16px;
  }
  blockquote {
    border-left: 3px solid ${themeColors.secondary};
    padding-left: 16px;
  }
  code {
    color: ${themeColors.error};
    padding: 4px;
    border-radius: 4px;
    background: ${themeColors.secondary};
  }
`;

export const MarkdownConvertor = ({ children }) => (
  <StyledMarkdown
    dangerouslySetInnerHTML={{ __html: convertor.render(children) }} // eslint-disable-line
  />
);

MarkdownConvertor.propTypes = {
  children: PropTypes.string,
};

export const MarkdownSwitch = ({ onChange }) => (
  <div>
    <span style={{ color: themeColors.secondary, fontSize: '0.9em', marginRight: '8px' }}>preview</span>
    <Switch size="small" onChange={onChange} />
  </div>
);

MarkdownSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export class MarkdownTextarea extends React.Component {
  state = { showMarkdown: false };

  componentWillMount() {
    const { value } = this.props; // eslint-disable-line
    this.setState({ value });
  }

  getWriter = () => {
    const { props } = this;
    const localValue = this.state.value;
    return <Input {...props} type="textarea" value={localValue} onChange={this.handleChange} />;
  };

  getReader = () => {
    const { value } = this.state;
    return <MarkdownConvertor>{value}</MarkdownConvertor>;
  };

  getWidget = () => {
    const { showMarkdown } = this.state;
    return showMarkdown ? this.getReader() : this.getWriter();
  };

  handleChange = event => {
    const { onChange } = this.props;
    const value = event.target.value;
    this.setState({ value });
    event.preventDefault();
    if (onChange) onChange(event);
  };

  handleMarkdownSwitch = () => this.setState({ showMarkdown: !this.state.showMarkdown });

  render() {
    return (
      <div>
        {this.getWidget()}
        <MarkdownSwitch onChange={this.handleMarkdownSwitch} />
      </div>
    );
  }
}

MarkdownTextarea.propTypes = {
  showMarkdown: PropTypes.bool,
  onChange: PropTypes.func,
};
