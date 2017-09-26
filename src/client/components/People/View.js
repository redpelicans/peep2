import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { map, prop } from 'ramda';
import { Colors } from '@blueprintjs/core';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Title, Container, Spacer, Tag, Tags } from '../widgets';

const FieldStyled = styled.div`grid-area: ${props => props.name};`;

const StyledBlock = styled.div`
  text-align: left;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  width: 100%;
  height: 40%;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const StyledBlockContent = styled.div`
  padding-top: 5px;
  margin-left: 15px;
`;

const StyledGrid = styled.div`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-column-gap: 25px;
  grid-template-columns: minmax(100px, auto) auto auto;
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 'prefix firstName lastName' 'company company company'
    'type jobType email' 'mobile fixe none' 'tags tags tags';
`;

const PersonInfos = ({ person = {} }) => {
  const {
    prefix,
    firstName,
    lastName,
    company,
    type,
    jobType,
    email,
    phones = [],
    tags = [],
  } = person;
  return (
    <StyledGrid>
      <FieldStyled name="prefix">
        <h4>Prefix : </h4>
        <StyledBlock>
          {prefix && <StyledBlockContent>{prefix}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="firstName">
        <h4>First Name : </h4>
        <StyledBlock>
          {firstName && <StyledBlockContent>{firstName}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="lastName">
        <h4>Last Name : </h4>
        <StyledBlock>
          {lastName && <StyledBlockContent>{lastName}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="company">
        <h4>Company : </h4>
        <StyledBlock>
          {company && <StyledBlockContent>{company}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="type">
        <h4>Type : </h4>
        <StyledBlock>
          {type && <StyledBlockContent>{type}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="jobType">
        <h4>Job Type : </h4>
        <StyledBlock>
          {jobType && <StyledBlockContent>{jobType}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      <FieldStyled name="email">
        <h4>Email : </h4>
        <StyledBlock>
          {email && <StyledBlockContent>{email}</StyledBlockContent>}
        </StyledBlock>
      </FieldStyled>
      {phones &&
        map(
          phone => (
            <FieldStyled key={phone.label} name={phone.label}>
              <h4>Mobile : </h4>
              <StyledBlock>
                <StyledBlockContent>{prop('number', phone)}</StyledBlockContent>
              </StyledBlock>
            </FieldStyled>
          ),
          phones,
        )}
      <FieldStyled name="tags">
        <h4>Tags : </h4>
        <StyledBlock>
          {tags && <Tags>{map(tag => <Tag key={tag}>{tag}</Tag>, tags)}</Tags>}
        </StyledBlock>
      </FieldStyled>
    </StyledGrid>
  );
};

PersonInfos.propTypes = {
  person: PropTypes.object,
};

const StyledGoBack = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

const GoBack = ({ history }) => (
  <StyledGoBack onClick={() => history.goBack()}>
    <i className="pt-icon-arrow-left" />
  </StyledGoBack>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

const Person = ({
  people = {},
  companies = {},
  history,
  match: { params: { id } },
}) => {
  //eslint-disable-line
  const person = people[id];
  if (!person || !companies) return null;
  person.company = companies[person.companyId].name || '';
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          <Avatar name={name} color={person.avatar.color} to="#" />
          <Spacer />
          <Title title={`${person.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <div />
        </HeaderRight>
      </Header>
      <PersonInfos person={person} />
    </Container>
  );
};

Person.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
});

const actions = { getPeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Person);
