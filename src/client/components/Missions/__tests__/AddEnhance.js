import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import serializer from 'enzyme-to-json/serializer';
import Component from '../Add';
import { defaultValues } from '../../../forms/missions';
import configureStore from '../../../store/configureStore';
import history from '../../../history';
import { addMission } from '../../../actions/missions';

expect.addSnapshotSerializer(serializer);

jest.mock('../../../actions/missions', () => ({
  addMission: jest.fn(() => ({ type: 'FakeType' })),
}));

history['goBack'] = jest.fn();

describe('app | components | Mission | component', () => {
  const store = configureStore({});
  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <Component history={history} />
      </Router>
    </Provider>,
  );

  describe('render', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('test cancel', () => {
    it('should cancel', () => {
      const buttons = wrapper.find('Button');
      const cancelButton = buttons.at(1);
      cancelButton.simulate('click');
      expect(history.goBack).toHaveBeenCalled();
    });
  });

  describe.skip('test add mission', () => {
    it('should submit', () => {
      const form = wrapper.find('form');
      form.simulate('submit');
      expect(history.goBack).toHaveBeenCalled();
      expect(addMission).toHaveBeenCalled();
    });
  });
});
