import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { getVisibleCompanies } from '../../selectors/companies';
import { List } from './List';
import { TitleIcon, Header, HeaderLeft, HeaderRight, Title, Search } from '../widgets/Header';
import SortMenu from '../widgets/SortMenu';
import { togglePreferredFilter, togglePreferred, filterCompanyList, sortCompanyList } from '../../actions/companies';

const Container = styled.div`
  display: grid;
  padding: 20px;
  width:95%;
  height:auto;
  margin:auto;
  margin-top:50px;
  background-color: #394b59;
  border-radius: 3px;
`;

class Companies extends Component {
  onFilterChange = (e) => {
    const { filterCompanyList } = this.props; // eslint-disable-line no-shadow
    filterCompanyList(e.target.value);
  }

  render() {
    const { companies, filter, sort, sortCompanyList } = this.props; // eslint-disable-line no-shadow

    return (
      <Container>
        <Header>
          <HeaderLeft>
            <TitleIcon name="pt-icon-standard pt-icon-home" />
            <Title title="Companies" />
          </HeaderLeft>
          <HeaderRight>
            <Search filter={filter} onChange={this.onFilterChange} style={{ margin: '0 16px' }} />
            <SortMenu onClick={sortCompanyList} sort={sort} />
          </HeaderRight>
        </Header>
        <List companies={companies} filterCompanyList={filterCompanyList} togglePreferred={togglePreferred} />
      </Container>
    );
  }
}


Companies.propTypes = {
};

Companies.propTypes = {
  companies: PropTypes.array.isRequired,
  filter: PropTypes.string,
  filterCompanyList: PropTypes.func.isRequired,
  sortCompanyList: PropTypes.func.isRequired,
  sort: PropTypes.object,
};

const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
  filter: state.companies.filter,
  sort: state.companies.sort,
});

const actions = { filterCompanyList, sortCompanyList, togglePreferred, togglePreferredFilter };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
