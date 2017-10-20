import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { compose, withStateHandlers } from 'recompose';
import { isEmpty, map, find, propEq } from 'ramda';
import { Colors, Button } from '@blueprintjs/core';
import { getPathByName } from '../../routes';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { deleteNote } from '../../actions/notes';
import { deletePeople } from '../../actions/people';
import { Auth } from '../../lib/kontrolo';
import { getRouteAuthProps } from '../../routes';

import {
  Title,
  Container,
  CompanyLink,
  ViewField,
  LinkButton,
  Tag,
  Spacer,
  Dates,
  ModalConfirmation,
} from '../widgets';
import { PreviewField } from '../widgets/ViewField';
import NotesView from './NotesView';

const StyledGrid = styled.div`
  display: grid;
  margin: 25px 0;
  width: 100%;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-rows: auto;
  grid-template-areas: 'prefix' 'firstName' 'lastName' 'company' 'type'
    'jobType' 'email' 'phones' 'skills' 'tags' 'roles' 'notes';
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'prefix firstName' 'lastName company' 'type jobType'
      'email none' 'phones phones' 'skills skills' 'tags tags' 'roles roles'
      'notes notes';
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    grid-template-rows: auto auto auto;
    grid-template-areas: 'prefix firstName firstName firstName lastName lastName lastName'
      'company company type jobType email email email'
      'phones phones phones phones phones phones phones'
      'skills skills skills skills skills skills skills'
      'tags tags tags tags tags tags tags'
      'roles roles roles roles roles roles roles'
      'notes notes notes notes notes notes notes';
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

const StyledTag = styled(Tag)`cursor: default;`;

const PhoneNumberText = styled.p`margin: 0;`;

const PhoneNumberContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
  grid-auto-rows: auto;
  grid-gap: 10px;
  margin-top: 10px;
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

const phoneIcons = [
  { label: 'mobile', iconName: 'pt-icon-mobile-phone' },
  { label: 'work', iconName: 'pt-icon-office' },
  { label: 'home', iconName: 'pt-icon-home' },
];

const PhoneField = ({ label, number }) => {
  const icon = find(propEq('label', label), phoneIcons);
  return (
    <PhoneNumber>
      <span className={icon ? icon.iconName : 'pt-icon-mobile-phone'} />
      <PhoneNumberText>{number}</PhoneNumberText>
    </PhoneNumber>
  );
};

PhoneField.propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
};

const StyledViewField = styled(ViewField)`grid-area: ${({ name }) => name};`;

const StyledPreviewField = styled(PreviewField)`
  grid-area: ${({ name }) => name};
`;

const ViewFieldArray = ({ label, items }) => (
  <StyledViewFieldArray>
    <label>{label}</label>
    <ReadOnlyField>
      {map(item => <StyledTag key={item}>{item}</StyledTag>, items)}
    </ReadOnlyField>
  </StyledViewFieldArray>
);

ViewFieldArray.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array,
};

const StyledViewFieldArray = styled.div`margin: 10px 0;`;

const StyledLink = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
  font-style: normal !important;
`;

const PersonInfos = ({ person = {}, deleteNote }) => {
  const {
    _id,
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
      <Dates updatedAt={person.updatedAt} createdAt={person.createdAt} />
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
            <div>
              <span style={{ marginRight: 10 }}>Company</span>
              {company && (
                <CompanyLink to={getPathByName('company', companyId)}>
                  <i className="fa fa-external-link" />
                </CompanyLink>
              )}
            </div>
          }
          value={company}
        />
        <StyledViewField name="type" label="Type" value={type} />
        <StyledViewField name="jobType" label="Job Type" value={jobType} />
        <StyledViewField
          name="email"
          label={
            <div>
              <span style={{ marginRight: 10 }}>Email</span>
              {email && (
                <StyledLink target="_blank" href={`mailto:${email}`}>
                  <span className="pt-icon-envelope" />
                </StyledLink>
              )}
            </div>
          }
          value={email}
        />
        {!isEmpty(phones) && (
          <StyledPreviewField
            name="phones"
            value={
              <div>
                <label>Phones</label>
                <PhoneNumberContainer>
                  {map(
                    phone => (
                      <PhoneField
                        key={phone.number}
                        label={phone.label}
                        number={phone.number}
                      />
                    ),
                    phones,
                  )}
                </PhoneNumberContainer>
              </div>
            }
          />
        )}
        {!isEmpty(skills) && (
          <StyledPreviewField
            name="skills"
            value={<ViewFieldArray label="Skills" items={skills} />}
          />
        )}
        {!isEmpty(tags) && (
          <StyledPreviewField
            name="tags"
            value={<ViewFieldArray label="Tags" items={tags} />}
          />
        )}
        {roles === null ||
          (!isEmpty(roles) && (
            <StyledPreviewField
              name="roles"
              value={<ViewFieldArray label="Roles" items={roles} />}
            />
          ))}
        <StyledPreviewField
          name="notes"
          value={
            <NotesView
              entityType="person"
              entityId={_id}
              deleteNote={deleteNote}
            />
          }
        />
      </StyledGrid>
    </StyledWrapper>
  );
};

PersonInfos.propTypes = {
  person: PropTypes.object,
  deleteNote: PropTypes.func.isRequired,
};

const GoBack = ({ history }) => (
  <StyledLink onClick={() => history.goBack()}>
    <span className="pt-icon-arrow-left" />
  </StyledLink>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

const Person = ({
  people = {},
  companies = {},
  history,
  match: { params: { id } },
  deleteNote,
  deletePeople,
  isDeleteDialogOpen,
  showDialog,
  hideDialog,
}) => {
  const person = people[id];
  if (!person || !companies) return null;
  const company = companies[person.companyId];
  person.company = company ? company.name : '';
  return (
    <Container>
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this person?"
        reject={() => hideDialog()}
        accept={() => {
          deletePeople(id);
          history.goBack();
        }}
      />
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          <Avatar name={person.name} size="LARGE" color={person.avatar.color} />
          <Spacer />
          <Title title={`${person.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <Auth {...getRouteAuthProps('deletePerson')} context={{ person }}>
            <Button
              iconName="pt-icon-trash"
              className="pt-button pt-large"
              onClick={() => showDialog()}
            />
          </Auth>
          <Spacer />
          <Auth {...getRouteAuthProps('editPerson')} context={{ person }}>
            <LinkButton
              to={getPathByName('editPerson', id)}
              iconName="pt-icon-edit"
              className="pt-button pt-large"
            />
          </Auth>
        </HeaderRight>
      </Header>
      <PersonInfos person={person} deleteNote={deleteNote} />
    </Container>
  );
};

Person.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  deleteNote: PropTypes.func.isRequired,
  deletePeople: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
});

const actions = { getPeople, deletePeople, deleteNote };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(
    {
      isDeleteDialogOpen: false,
    },
    {
      showDialog: () => () => ({ isDeleteDialogOpen: true }),
      hideDialog: () => () => ({ isDeleteDialogOpen: false }),
    },
  ),
);

export default enhance(Person);
