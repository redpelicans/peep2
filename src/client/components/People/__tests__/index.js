import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';
import Avatar from '../../Avatar';
import List from '../List';
import { Tags, Tag, Actions } from '../../widgets';
import enhancedPreview, { Preview } from '../Preview';

const { describe, it } = global;

describe('List component', () => {
  it('should not render anything', () => {
    const wrapper = shallow(
      <List people={[]} companies={{}} deletePeople={() => {}} onTagClick={() => {}} />,
    );
    should(wrapper.find(enhancedPreview)).have.length(0);
  });
  it('should render 6 enhancedPreview component', () => {
    const wrapper = shallow(
      <List
        deletePeople={() => {}}
        onTagClick={() => {}}
        companies={{}}
        people={[
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
          {
            _id: 3,
            name: '3',
          },
          {
            _id: 4,
            name: '4',
          },
          {
            _id: 5,
            name: '5',
          },
        ]}
        filterCompanyList={() => {}}
      />,
    );
    should(wrapper.find(enhancedPreview)).have.length(6);
  });
});

describe('Preview component', () => {
  it('Basic Preview', () => {
    const wrapper = shallow(
      <Preview
        person={{
          name: 'test',
          avatar: {
            color: 'red',
          },
          tags: [],
        }}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
        showActions={true}
        onTagClick={() => {}}
        deletePeople={() => {}}
        handleDeletePeople={() => {}}
      />,
    );
    should(wrapper.find(Tags)).have.length(0);
    should(wrapper.find(Avatar)).have.length(1);
  });
  it('Preview should have 5 tag', () => {
    const wrapper = shallow(
      <Preview
        person={{
          name: 'test2',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
        showActions={false}
        onTagClick={() => {}}
        deletePeople={() => {}}
        handleDeletePeople={() => {}}
      />,
    );
    should(wrapper.find(Tags)).have.length(1);
    should(wrapper.find(Tag)).have.length(5);
  });
  it('Preview should not have actions button displayed', () => {
    const wrapper = shallow(
      <Preview
        person={{
          name: 'test2',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
        showActions={false}
        onTagClick={() => {}}
        deletePeople={() => {}}
        handleDeletePeople={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(0);
  });
  it('Preview should have actions button displayed', () => {
    const wrapper = shallow(
      <Preview
        person={{
          name: 'test2',
          avatar: {
            color: 'red',
          },
          tags: ['0', '1', '2', '3', '4'],
        }}
        handleMouseEnter={() => {}}
        handleMouseLeave={() => {}}
        showActions={true}
        onTagClick={() => {}}
        deletePeople={() => {}}
        handleDeletePeople={() => {}}
      />,
    );
    should(wrapper.find(Actions)).have.length(1);
  });
});
