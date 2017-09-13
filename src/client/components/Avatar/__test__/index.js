import React from 'react';
import chai from 'chai'; // eslint-disable-line
import { shallow } from 'enzyme'; // eslint-disable-line
import { Tooltip } from 'antd';
import Avatar, { Circle } from '..';

const { describe, it } = global;
const { expect } = chai;

const props = { name: 'Name Test', color: 'red' };

describe('<Avatar />', () => {
  it('should render a <Circle />', () => {
    expect(shallow(<Avatar {...props} />)
      .find(Circle)).to.have.lengthOf(1);
  });

  it('should render a <Tooltip />', () => {
    expect(shallow(<Avatar {...props} />)
      .find(Tooltip)).to.have.lengthOf(1);
  });
});
