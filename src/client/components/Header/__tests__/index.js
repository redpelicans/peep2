import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';
import {
  Header,
  HeaderLeft,
  HeaderRight,
  StyledTimeElement,
  StyledHeaderElement,
  StyledHeaderLeftElement,
  StyledHeaderRightElement,
} from '..';

describe('HeaderRight component', () => {
  it('should find a StyledHeaderRightElement', () => {
    const wrapper = shallow(<HeaderRight />);
    should(wrapper.find(StyledHeaderRightElement)).have.length(1);
  });
});

describe('HeaderLeft component', () => {
  it('should find a StyledHeaderLeftElement', () => {
    const wrapper = shallow(<HeaderLeft />);
    should(wrapper.find(StyledHeaderLeftElement)).have.length(1);
  });
});

describe('Header component', () => {
  it('should find a div', () => {
    const wrapper = shallow(<Header />);
    should(wrapper.find('div')).have.length(1);
  });
  it('should find a StyledHeaderElement in div child', () => {
    const wrapper = shallow(<Header />);
    should(wrapper.contains(<StyledHeaderElement />)).eql(true);
  });
  it('should not find a StyledTimeElement in div child', () => {
    const wrapper = shallow(<Header />);
    should(wrapper.contains(<StyledTimeElement />)).eql(false);
  });
});
