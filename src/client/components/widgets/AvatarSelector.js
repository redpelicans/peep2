import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popover } from '@blueprintjs/core';
import { compose, join, map, take, split } from 'ramda';
import colors, { randomColor } from '../../utils/colors';

export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  min-width: 45px;
  max-width: 45px;
  min-height: 45px;
  max-height: 45px;
  color: #FFF;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0,0,0,0.07);
`;

const ColorCase = styled.div`
  background-color: ${props => props.color};
  width:30px;
  height:30px;
`;

const ColorSelectorElt = styled.div`
  display:flex;
  width:400px;
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));


class AvatarSelector extends Component {
  state = {
    selectedColor: randomColor(),
    name: '',
    showIcon: false,
  };

  handleMouseEnter = () => {
    this.setState({ showIcon: true });
  }

  handleMouseLeave = () => {
    this.setState({ showIcon: false });
  }

  render() {
    const { selectedColor, showIcon } = this.state;
    const { name = '', handleChangeColor } = this.props;
    const ColorSelector = () => (
      <ColorSelectorElt>
        {colors.map(color => <ColorCase key={color} onClick={() => (this.setState({ selectedColor: color }, handleChangeColor(color)))} color={color} />)}
      </ColorSelectorElt>
    );
    return (
      <Popover
        content={<ColorSelector />}
        target={
          <Circle
            color={selectedColor}
            onMouseOver={this.handleMouseEnter}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            {showIcon && <span className="pt-icon-standard pt-icon-edit" />}
            { initials(name) }
          </Circle>
        }
      />
    );
  }
}

AvatarSelector.propTypes = {
  name: PropTypes.string,
  handleChangeColor: PropTypes.func.isRequired,
};

export default AvatarSelector;
