import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import Actions from '../Actions';

describe('<Actions />', () => {
  test('should render an <Action />', () => {
    const tree = shallow(<Actions />);
    expect(tree).toMatchSnapshot();
  });
  test('should <Actions /> be flex', () => {
    const tree = shallow(<Actions />);
    expect(tree).toHaveStyleRule('display', 'flex');
  });
});
