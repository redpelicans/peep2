import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import NameLink from '../NameLink';

describe('<NameLink />', () => {
  test('should render an <NameLink />', () => {
    const tree = shallow(<NameLink to="" />);
    expect(tree).toMatchSnapshot();
  });
  test('should <NameLink /> have text transform', () => {
    const tree = shallow(<NameLink to="" />);
    expect(tree).toHaveStyleRule('text-transform', 'capitalize');
  });
});
