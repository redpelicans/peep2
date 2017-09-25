import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';
import { getVisiblePeople, getFilter } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import List from './List';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Search, Spacer, Title, LinkButton } from '../widgets';
import { onTagClick, deletePeople } from '../../actions/people';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const People = ({
  people,
  companies,
  onTagClick,
  onFilterChange,
  filter = '',
  deletePeople,
}) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-home" />
        <Spacer />
        <Title title="People" />
      </HeaderLeft>
      <HeaderRight>
        <Search
          filter={filter}
          onChange={onFilterChange}
          resetValue={() => onTagClick('')}
        />
        <StyledLinkButton to="/people/add" iconName="plus" />
      </HeaderRight>
    </Header>
    <List
      people={people}
      companies={companies}
      onTagClick={onTagClick}
      deletePeople={deletePeople}
    />
  </Container>
);

People.propTypes = {
  people: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
  deletePeople: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getVisiblePeople(state),
  companies: getCompanies(state),
  filter: getFilter(state),
});

const actions = { onTagClick, deletePeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ onTagClick }) => event => onTagClick(event.target.value),
  }),
);

export default enhance(People);
