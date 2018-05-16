import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Add as Component } from '../Add';
import configureStore from '../../../store/configureStore';
import { defaultValues } from '../../../forms/missions';
import createHistory from 'history/createBrowserHistory';
import { mockDate } from '../../../utils/date';

const root = (props, history = createHistory()) => {
  const store = configureStore({});
  return (
    <Provider store={store}>
      <Router history={history}>
        <Component history={history} {...props} />
      </Router>
    </Provider>
  );
};

mockDate();

describe('app | components | Mission | component', () => {
  const props = {
    isSubmitting: false,
    isValid: true,
    handleReset: jest.fn(),
    handleSubmit: jest.fn(),
    dirty: false,
    values: defaultValues,
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    clients: {},
    errors: {},
    touched: {},
  };

  describe('render', () => {
    it('should match snapshot', () => {
      const wrapper = mount(root(props));
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('test buttons', () => {
    it('should get 3 buttons', () => {
      const wrapper = mount(root(props));
      const buttons = wrapper.find('Button');
      expect(buttons).toHaveLength(3);
    });

    it('should cancel', () => {
      const localProps = { ...props, dirty: false };
      const history = createHistory();
      history['goBack'] = jest.fn();
      const wrapper = mount(root(localProps, history));
      const buttons = wrapper.find('Button');
      const button = buttons.at(1);
      button.simulate('click');
      expect(history.goBack).toHaveBeenCalled();
    });

    it('should reset', () => {
      const localProps = { ...props, dirty: true };
      const wrapper = mount(root(localProps));
      const buttons = wrapper.find('Button');
      const button = buttons.at(2);
      button.simulate('click');
      expect(props.handleReset).toHaveBeenCalled();
    });

    it('should submit', () => {
      const localProps = { ...props, isValid: true, dirty: true };
      const wrapper = mount(root(localProps));
      const form = wrapper.find('form');
      form.simulate('submit');
      expect(props.handleSubmit).toHaveBeenCalled();
    });
  });
});
