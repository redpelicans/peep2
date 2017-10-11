import React from 'react';
import 'jest-styled-components';
import { shallow } from 'enzyme'; // eslint-disable-line
import PreviewContainer from '../PreviewContainer';

describe('<PreviewContainer />', () => {
  test('should render a <PreviewContainer />', () => {
    const tree = shallow(<PreviewContainer />);
    expect(tree).toMatchSnapshot();
  });
  test('should <PreviewContainer /> have justify-content to center', () => {
    const tree = shallow(<PreviewContainer />);
    expect(tree).toHaveStyleRule('justify-content', 'center');
  });
});
