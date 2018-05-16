import React from 'react';
import { shallow } from 'enzyme';
import Component from '../AddOrEdit';
import { defaultValues } from '../../../forms/missions';
import { mockDate } from '../../../utils/date';

mockDate();

describe('app | components | Mission | component', () => {
  describe('render', () => {
    const props = {
      handleSubmit: jest.fn(),
      values: defaultValues,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      errors: {},
      touched: {},
    };

    it('should be defined', () => {
      // given
      const wrapper = shallow(<Component {...props} />);

      // then
      expect(wrapper).toBeDefined();
    });

    it('should match snapshot', () => {
      // given
      const wrapper = shallow(<Component {...props} />);

      // then
      expect(wrapper).toMatchSnapshot();
    });
  });
});
