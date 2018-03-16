import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { Menu, MenuDivider } from '@blueprintjs/core';
import {
  filterNotesList,
  sortNotesList,
  deleteNote,
  updateNote,
} from '../../actions/notes';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Title, Search, Spacer, LinkButton } from '../widgets';
import List from './List';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getFilter, getVisibleNotes, getSort } from '../../selectors/notes';
import { ContextMenu, ContextSort } from '../widgets/ContextMenu';

const sortItems = [
  { label: 'createdAt', text: 'Creation date' },
  { label: 'updatedAt', text: 'Updated date' },
];

const Notes = ({
  filterNotesList,
  sortNotesList,
  handleFilterChange,
  notes,
  companies,
  people,
  sort,
  filter = '',
  deleteNote,
}) => {
  if (!notes || !people || !companies) return null;
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-document" />
          <Spacer />
          <Title title="Notes" />
        </HeaderLeft>
        <HeaderRight>
          <Search
            filter={filter}
            onChange={handleFilterChange}
            resetValue={() => filterNotesList('')}
          />
          <Spacer />
          <ContextMenu
            content={
              <Menu>
                <MenuDivider title="Notes" />
                <LinkButton
                  className="pt-minimal"
                  to="/notes/add"
                  iconName="pt-icon-add"
                  text="Add"
                />
                <ContextSort
                  currentSort={sort}
                  sortItems={sortItems}
                  setSort={sortNotesList}
                />
              </Menu>
            }
          />
        </HeaderRight>
      </Header>
      <List
        notes={notes}
        companies={companies}
        people={people}
        deleteNote={deleteNote}
        updateNote={updateNote}
      />
    </Container>
  );
};

Notes.propTypes = {
  notes: PropTypes.array,
  filter: PropTypes.string,
  companies: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  filterNotesList: PropTypes.func.isRequired,
  sortNotesList: PropTypes.func.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  deleteNote: PropTypes.func.isRequired,
  updateNote: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notes: getVisibleNotes(state),
  people: getPeople(state),
  companies: getCompanies(state),
  filter: getFilter(state),
  sort: getSort(state),
});

const actions = { filterNotesList, sortNotesList, deleteNote, updateNote };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleFilterChange: ({ filterNotesList }) => event =>
      filterNotesList(event.target.value),
  }),
);

export default enhance(Notes);
