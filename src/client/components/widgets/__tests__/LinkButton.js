import React from 'react';
import { Button } from '@blueprintjs/core';
import { shallow } from 'enzyme'; // eslint-disable-line
import { LinkButton } from '../LinkButton';

describe('<LinkButton />', () => {
  test('should render a <Button />', () => {
    const wrapper = shallow(<LinkButton />);
    expect(wrapper.find(Button).equals(true));
  });
});
