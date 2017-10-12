import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import Tags from '../Tags';

describe('<Tags />', () => {
  test('should render a <Tags />', () => {
    const tree = shallow(<Tags />);
    expect(tree).toMatchSnapshot();
  });
  test('should <Tags /> have display flex', () => {
    const tree = shallow(<Tags />);
    expect(tree).toHaveStyleRule('display', 'flex');
  });
});
