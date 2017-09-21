import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { getVisibleCompanies } from '../../selectors/companies';
import { List } from './List';
import styled from 'styled-components';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Search, SortMenu, Title, Spacer, LinkButton } from '../widgets';
import { togglePreferredFilter, togglePreferred, filterCompanyList, sortCompanyList } from '../../actions/companies';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const Companies = ({ companies, filter, sort, sortCompanyList, filterCompanyList, handleFilterChange }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-home" />
        <Spacer />
        <Title title="Companies" />
      </HeaderLeft>
      <HeaderRight>
        <Search filter={filter} onChange={handleFilterChange} resetValue={() => filterCompanyList('')} />
        <SortMenu onClick={sortCompanyList} sort={sort} />
        <StyledLinkButton to="/companies/add" iconName="plus" />
      </HeaderRight>
    </Header>
    <List companies={companies} filterCompanyList={filterCompanyList} togglePreferred={togglePreferred} />
  </Container>
);

Companies.propTypes = {
  companies: PropTypes.array.isRequired,
  filter: PropTypes.string,
  filterCompanyList: PropTypes.func.isRequired,
  sortCompanyList: PropTypes.func.isRequired,
  sort: PropTypes.object,
  handleFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
  filter: state.companies.filter,
  sort: state.companies.sort,
});

const actions = {
  filterCompanyList,
  sortCompanyList,
  togglePreferred,
  togglePreferredFilter,
};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleFilterChange: ({ filterCompanyList }) => event => filterCompanyList(event.target.value),
  }),
);

export default enhance(Companies);
