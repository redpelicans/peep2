import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';
import List from '../List';
import { Formik } from 'formik';
import Avatar from '../../Avatar';
import { Tags, Tag, Actions } from '../../widgets';
import { Form } from '../Add';
import enhancedPreview, { Preview, Title } from '../Preview';

const { describe, it } = global;

describe('List component', () => {
  it('should not render anything', () => {
    const wrapper = shallow(
      <List companies={[]} filterCompanyList={() => {}} />,
    );
    should(wrapper.find(enhancedPreview)).have.length(0);
  });
  it('should render 3 enhancedPreview component', () => {
    const wrapper = shallow(
      <List
        companies={[
          {
            _id: 0,
            name: '0',
          },
          {
            _id: 1,
            name: '1',
          },
          {
            _id: 2,
            name: '2',
          },
        ]}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(enhancedPreview)).have.length(3);
  });
});

describe('Preview component', () => {
  it('Basic Preview', () => {
    const wrapper = shallow(
      <Preview
        company={{
          name: 'test',
          avatar: {
            color: 'red',
          },
          tags: [],
        }}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(Tags)).have.length(0);
    should(wrapper.find(Title)).have.length(1);
    should(wrapper.find(Avatar)).have.length(1);
  });
  it('Preview should have 5 tag', () => {
    const wrapper = shallow(
      <Preview
        company={{
          name: 'test',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(Tags)).have.length(1);
    should(wrapper.find(Tag)).have.length(5);
  });
  it('Preview should have actions button displayed', () => {
    const wrapper = shallow(
      <Preview
        company={{
          name: 'test2',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        showActions={true}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(1);
  });
  it('Preview should not have actions button displayed', () => {
    const wrapper = shallow(
      <Preview
        company={{
          name: 'test2',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        showActions={false}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(0);
  });
});
