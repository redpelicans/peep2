import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';
import Message from '..';

const { describe, it } = global;

describe('Message component', () => {
  it('should not render anything', () => {
    const wrapper = shallow(<Message />);
    should(wrapper.find('div')).have.length(0);
  });
});
