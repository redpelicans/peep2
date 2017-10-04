import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { isEmpty, map } from 'ramda';
import { Colors } from '@blueprintjs/core';
import { getPathByName } from '../../routes';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import {
  Title,
  Container,
  CompanyLink,
  ViewField,
  LinkButton,
  Tag,
  Spacer,
} from '../widgets';

const StyledGrid = styled.div`
  display: grid;
  margin: 25px 0;
  width: 100%;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-rows: auto;
  grid-template-areas: 'prefix' 'firstName' 'lastName' 'company' 'type'
    'jobType' 'email';
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'prefix firstName' 'lastName company' 'type jobType'
      'email none';
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    grid-template-rows: auto auto auto;
    grid-template-areas: 'prefix firstName firstName firstName lastName lastName lastName'
      'company company type jobType email email email';
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReadOnlyField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 100%;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
  flex-direction: row;
  margin-top: 10px;
`;

const StyledTag = styled(Tag)`
  cursor: default;
`;

const PhoneNumberText = styled.p`margin: 0;`;

const PhoneNumberContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
  grid-auto-rows: auto;
  grid-gap: 10px;
  background-color: ${Colors.DARK_GRAY3};
  min-height: 26px;
  border-radius: 4px;
  width: 100%;
  padding: 10px;
`;
const PhoneNumber = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: ${Colors.DARK_GRAY5};
  border-radius: 4px;
  padding: 10px;
`;

const PhoneField = ({ label, number }) => (
  <PhoneNumber>
    <PhoneNumberText>{label}</PhoneNumberText>
    <PhoneNumberText>{number}</PhoneNumberText>
  </PhoneNumber>
);

PhoneField.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
};

const StyledViewField = styled(ViewField)`grid-area: ${({ name }) => name};`;

const ViewFieldArray = ({ label, items }) => (
  <StyledViewFieldArray>
    <label>{label}</label>
    <ReadOnlyField>
      {map(
        item => (
          <StyledTag key={item}>
            {item}
          </StyledTag>
        ),
        items,
      )}
    </ReadOnlyField>
  </StyledViewFieldArray>
);

ViewFieldArray.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array,
};

const StyledViewFieldArray = styled.div`
  margin: 10px 0;
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
    skills = [],
    tags = [],
    roles = [],
    companyId,
  } = person;
  return (
    <StyledWrapper>
      <StyledGrid>
        <StyledViewField name="prefix" label="Prefix" value={prefix} />
        <StyledViewField
          name="firstName"
          label="First Name"
          value={firstName}
        />
        <StyledViewField name="lastName" label="Last Name" value={lastName} />
        <StyledViewField
          name="company"
          label={
            (
              <div>
                <span style={{ marginRight: 10 }}>Company</span>
                {company && <CompanyLink to={getPathByName('company', companyId)}>
                  <i className="fa fa-external-link" />
                </CompanyLink>}
              </div>
            )
          }
          value={company}
        />
        <StyledViewField name="type" label="Type" value={type} />
        <StyledViewField name="jobType" label="Job Type" value={jobType} />
        <StyledViewField name="email" label="Email" value={email} />
      </StyledGrid>
      {!isEmpty(phones) > 0 && (
        <div>
          <label>Phones</label>
          <PhoneNumberContainer>
            {map(
              phone => (
                <PhoneField
                  key={phone.label}
                  label={phone.label}
                  number={phone.number}
                />
              ),
              phones,
            )}
          </PhoneNumberContainer>
        </div>
      )}
      {!isEmpty(skills) && (<ViewFieldArray label="Skills" items={skills} />)}
      {!isEmpty(tags) && (<ViewFieldArray label="Tags" items={tags} />)}
      {roles === null || !isEmpty(roles) && (<ViewFieldArray label="Roles" items={roles} />)}
    </StyledWrapper>
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
  const person = people[id];
  if (!person || !companies) return null;
  const company = companies[person.companyId];
  person.company = company ? company.name : '';
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          <Avatar name={person.name} size="LARGE" color={person.avatar.color} />
          <Spacer />
          <Title title={`${person.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <LinkButton
            to={getPathByName('editPerson', id)}
            iconName="pt-icon-edit"
            className="pt-button pt-large"
          />
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
