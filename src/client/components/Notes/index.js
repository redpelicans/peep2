import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';
import { filterNotesList } from '../../actions/notes';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Title, Search, Spacer, LinkButton } from '../widgets';
import List from './List';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getFilter, getVisibleNotes } from '../../selectors/notes';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const Notes = ({
  filterNotesList,
  handleFilterChange,
  notes,
  companies,
  people,
  filter = '',
}) => {
  if (!notes || !people || !companies) return null;
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-home" />
          <Spacer />
          <Title title="Notes" />
        </HeaderLeft>
        <HeaderRight>
          <Search
            filter={filter}
            onChange={handleFilterChange}
            resetValue={() => filterNotesList('')}
          />
          <StyledLinkButton to="/notes/add" iconName="plus" />
        </HeaderRight>
      </Header>
      <List notes={notes} companies={companies} people={people} />
    </Container>
  );
};

Notes.propTypes = {
  notes: PropTypes.array.isRequired,
  filter: PropTypes.string,
  companies: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  filterNotesList: PropTypes.func.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notes: getVisibleNotes(state),
  people: getPeople(state),
  companies: getCompanies(state),
  filter: getFilter(state),
});

const actions = { filterNotesList };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleFilterChange: ({ filterNotesList }) => event =>
      filterNotesList(event.target.value),
  }),
);

export default enhance(Notes);
