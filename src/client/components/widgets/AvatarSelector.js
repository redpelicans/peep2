import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popover, Position } from '@blueprintjs/core';
import { compose, join, map, take, split } from 'ramda';
import colors from '../../utils/colors';

export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  min-width: 45px;
  max-width: 45px;
  min-height: 45px;
  max-height: 45px;
  color: #fff;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const ColorCase = styled.div`
  background-color: ${props => props.color};
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    height: 25px;
  }
`;

const ColorSelectorElt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
`;

const Icon = styled.span`
  position: absolute;
  text-align: center;
  right: 0;
  top: 0;
  min-width: 45px;
  max-width: 45px;
  min-height: 45px;
  max-height: 45px;
  padding-top: 15px;
  border-radius: 50%;
  background-color: rgba(25, 25, 25, 0.2);
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));

class AvatarSelector extends Component {
  state = {
    showIcon: false,
  };

  handleMouseEnter = () => {
    this.setState({ showIcon: true });
  };

  handleMouseLeave = () => {
    this.setState({ showIcon: false });
  };

  handleChangeColor = color => {
    const { setFieldValue, setFieldTouched } = this.props;
    setFieldTouched('color', color);
    setFieldValue('color', color);
  };

  render() {
    const { showIcon } = this.state;
    const { name = '', lastName = '', formId, color } = this.props;
    const ColorSelector = () => (
      <ColorSelectorElt>
        {colors.map(color => (
          <ColorCase
            className="pt-popover-dismiss"
            key={color}
            onClick={() => this.handleChangeColor(color)}
            color={color}
          />
        ))}
      </ColorSelectorElt>
    );
    return (
      <Popover
        content={<ColorSelector />}
        position={Position.BOTTOM_LEFT}
        popoverClassName="pt-popover-content-sizing"
        target={
          <div>
            <input
              type="hidden"
              id="color"
              name="color"
              form={formId}
              value={color}
            />
            <Circle
              color={color}
              onMouseOver={this.handleMouseEnter}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              {showIcon && <Icon className="pt-icon-standard pt-icon-edit" />}
              {!showIcon && initials(name)}
              {!showIcon && initials(lastName)}
            </Circle>
          </div>
        }
      />
    );
  }
}

AvatarSelector.propTypes = {
  name: PropTypes.string,
  formId: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  lastName: PropTypes.string,
  color: PropTypes.string.isRequired,
};

export default AvatarSelector;
