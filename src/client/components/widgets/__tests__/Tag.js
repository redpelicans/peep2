import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import Tag from '../Tag';

describe('<Tag />', () => {
  test('should render a <Tag />', () => {
    const tree = shallow(<Tag />);
    expect(tree).toMatchSnapshot();
  });
  test('should <Tag /> have pointer cursor', () => {
    const tree = shallow(<Tag />);
    expect(tree).toHaveStyleRule('cursor', 'pointer');
  });
});
