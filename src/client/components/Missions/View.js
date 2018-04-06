import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { compose, withStateHandlers } from 'recompose';
import { format } from 'date-fns';
import {
  Colors,
  Button,
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
} from '@blueprintjs/core';
import Avatar from '../Avatar';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import {
  getMission,
  getClient,
  getManager,
  getWorkers,
} from '../../selectors/missions';
import { getFilter } from '../../selectors/addenda';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import {
  Title,
  Container,
  Spacer,
  LinkButton,
  Dates,
  ModalConfirmation,
} from '../widgets';
import { ContextMenu, ContextFilter } from '../widgets/ContextMenu';
import { PreviewField } from '../widgets/ViewField';
import { deleteMission } from '../../actions/missions';
import { deleteCompany } from '../../actions/companies';
import { deleteNote } from '../../actions/notes';
import { deletePeople } from '../../actions/people';
import { setFilter } from '../../actions/addenda';
import { getPathByName } from '../../routes';
import { Auth } from '../../lib/kontrolo';
import { getRouteAuthProps } from '../../routes';
import PersonPreview from '../People/Preview';
import CompanyPreview from '../Companies/Preview';
import NotesView from './NotesView';
import AddendaView from './AddendaView';

const StyledGrid = styled.div`
  display: grid;
  margin: 25px 0;
  width: 100%;
  gird-template-rows: auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-areas: 'startdate' 'enddate' 'client' 'manager' 'workers'
    'billedTarget' 'allowWeekends' 'addenda' 'notes';
  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'startdate enddate' 'client manager' 'workers null'
      'billedTarget allowWeekends' 'addenda addenda' 'notes notes';
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'startdate startdate enddate enddate'
      'client client manager manager' 'workers workers workers workers'
      'billedTarget billedTarget allowWeekends allowWeekends'
      'addenda addenda addenda addenda' 'notes notes notes notes';
  }
`;

const ArrayBlock = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const StyledLink = styled.a`
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
  font-style: normal !important;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding-left: 0.8em;
  padding-right: 0.8em;
  height: 30px;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  margin-top: 15px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const FormattedMissionDate = ({ date }) => (
  <StyledField>
    {date && <span>{format(date, 'MM/DD/YYYY')}</span>}
    {date && <Icon icon="calendar" />}
  </StyledField>
);

FormattedMissionDate.propTypes = {
  date: PropTypes.string,
};

const StyledPreviewField = styled(PreviewField)`
  grid-area: ${props => props.name};
`;

const StyledClientWrapper = styled.div`position: relative;`;

const StyledManagerWrapper = styled.div`position: absolute;`;

const MissionInfos = ({
  id,
  client,
  manager,
  startDate,
  endDate,
  createdAt,
  updatedAt,
  billedTarget,
  allowWeekends,
  isAddendaModalOpen,
  showAddendaModal,
  hideAddendaModal,
  isNoteModalOpen,
  showNoteModal,
  hideNoteModal,
}) => {
  return (
    <StyledWrapper>
      <Dates createdAt={createdAt} updatedAt={updatedAt} />
      <StyledGrid>
        <StyledPreviewField
          name="startdate"
          label="Start Date"
          value={<FormattedMissionDate date={startDate} />}
        />
        <StyledPreviewField
          name="enddate"
          label="End Date"
          value={<FormattedMissionDate date={endDate} />}
        />
        {client && (
          <StyledPreviewField
            name="client"
            label="Client"
            value={
              <ArrayBlock>
                <StyledClientWrapper>
                  <CompanyPreview
                    key={client._id}
                    company={client}
                    deleteCompany={deleteCompany}
                  />
                </StyledClientWrapper>
              </ArrayBlock>
            }
          />
        )}
        {manager && (
          <StyledPreviewField
            name="manager"
            label="Manager"
            value={
              <ArrayBlock>
                <StyledManagerWrapper>
                  <PersonPreview
                    key={manager._id}
                    person={manager}
                    deletePeople={deletePeople}
                  />
                </StyledManagerWrapper>
              </ArrayBlock>
            }
          />
        )}
        <StyledPreviewField
          name="billedTarget"
          label="Billed Target"
          value={<StyledField>{billedTarget}</StyledField>}
        />
        <StyledPreviewField
          name="allowWeekends"
          label="Weekends"
          value={
            <StyledField>{allowWeekends ? 'Allow' : 'Not Allow'}</StyledField>
          }
        />
        <StyledPreviewField
          name="addenda"
          value={
            <AddendaView
              isModalOpen={isAddendaModalOpen}
              showModal={showAddendaModal}
              hideModal={hideAddendaModal}
              missionId={id}
            />
          }
        />
        <StyledPreviewField
          name="notes"
          value={
            <NotesView
              entityType="mission"
              entityId={id}
              isModalOpen={isNoteModalOpen}
              showModal={showNoteModal}
              hideModal={hideNoteModal}
              deleteNote={deleteNote}
            />
          }
        />
      </StyledGrid>
    </StyledWrapper>
  );
};

MissionInfos.propTypes = {
  id: PropTypes.string,
  client: PropTypes.object,
  manager: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  billedTarget: PropTypes.string,
  allowWeekends: PropTypes.bool,
  isAddendaModalOpen: PropTypes.bool,
  showAddendaModal: PropTypes.func,
  hideAddendaModal: PropTypes.func,
  isNoteModalOpen: PropTypes.bool,
  showNoteModal: PropTypes.func,
  hideNoteModal: PropTypes.func,
};

const GoBack = ({ history }) => (
  <StyledLink onClick={() => history.goBack()}>
    <span className="pt-icon-arrow-left" />
  </StyledLink>
);

GoBack.propTypes = {
  history: PropTypes.object,
};

export const FilterItems = [
  { label: 'all', text: 'All' },
  { label: 'current', text: 'Current' },
  { label: 'past', text: 'Past' },
];

const Mission = ({
  history,
  id,
  mission,
  client,
  manager,
  startDate,
  endDate,
  createdAt,
  updatedAt,
  workers,
  billedTarget,
  allowWeekends,
  showDialog,
  hideDialog,
  isDeleteDialogOpen,
  isAddendaModalOpen,
  showAddendaModal,
  hideAddendaModal,
  isNoteModalOpen,
  showNoteModal,
  hideNoteModal,
  filter,
  setFilter,
}) => {
  if (!mission) return null;
  return (
    <Container>
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this mission?"
        reject={() => hideDialog()}
        accept={() => {
          deleteMission(id);
          history.goBack();
        }}
      />
      <Header>
        <HeaderLeft>
          <GoBack history={history} />
          <Spacer />
          {client && (
            <Avatar
              name={client.name}
              size="LARGE"
              color={client.avatar.color}
            />
          )}
          <Spacer />
          <Title title={`${mission.name}`} />
        </HeaderLeft>
        <HeaderRight>
          <Auth {...getRouteAuthProps('deleteMission')} context={{ mission }}>
            <Button
              icon="trash"
              className="pt-button pt-large pt-intent-danger"
              onClick={() => showDialog()}
            />
          </Auth>
          <Spacer />
          <Auth {...getRouteAuthProps('editMission')} context={{ mission }}>
            <LinkButton
              to={getPathByName('editMission', id)}
              icon="edit"
              className="pt-button pt-large pt-intent-warning"
            />
          </Auth>
          <Spacer />
          <ContextMenu
            content={
              <Menu>
                <MenuDivider title="Addenda" />
                <MenuItem
                  className="pt-icon-add"
                  onClick={() => showAddendaModal()}
                  text="Add"
                />
                <ContextFilter
                  currentFilter={filter}
                  filterItems={FilterItems}
                  setFilter={setFilter}
                />
                <MenuDivider title="Notes" />
                <MenuItem
                  className="pt-icon-add"
                  onClick={() => showNoteModal()}
                  text="Add"
                />
              </Menu>
            }
          />
        </HeaderRight>
      </Header>
      <MissionInfos
        id={id}
        client={client}
        manager={manager}
        startDate={startDate}
        endDate={endDate}
        createdAt={createdAt}
        updatedAt={updatedAt}
        workers={workers}
        billedTarget={billedTarget}
        allowWeekends={allowWeekends}
        isAddendaModalOpen={isAddendaModalOpen}
        showAddendaModal={showAddendaModal}
        hideAddendaModal={hideAddendaModal}
        isNoteModalOpen={isNoteModalOpen}
        showNoteModal={showNoteModal}
        hideNoteModal={hideNoteModal}
      />
    </Container>
  );
};

Mission.propTypes = {
  history: PropTypes.object,
  mission: PropTypes.object,
  id: PropTypes.string,
  client: PropTypes.object,
  manager: PropTypes.object,
  workers: PropTypes.array,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  billedTarget: PropTypes.string,
  allowWeekends: PropTypes.bool,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  isAddendaModalOpen: PropTypes.bool,
  showAddendaModal: PropTypes.func,
  hideAddendaModal: PropTypes.func,
  isNoteModalOpen: PropTypes.bool,
  showNoteModal: PropTypes.func,
  hideNoteModal: PropTypes.func,
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};

const mapStateToProps = (state, { match: { params: { id } } }) => {
  const mission = getMission(state, id);
  const filter = getFilter(state);
  if (!mission) return {};
  const {
    clientId,
    managerId,
    workerIds,
    startDate,
    endDate,
    createdAt,
    updatedAt,
    billedTarget,
    allowWeekends,
  } = mission;
  const people = getPeople(state);
  const companies = getCompanies(state);
  const client = getClient(clientId, companies);
  const manager = getManager(managerId, people);
  const workers = workerIds ? getWorkers(people, workerIds) : [];
  return {
    id,
    mission,
    client,
    manager,
    startDate,
    endDate,
    createdAt,
    updatedAt,
    billedTarget,
    allowWeekends,
    workers,
    filter,
  };
};

const actions = { setFilter };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(
    {
      isDeleteDialogOpen: false,
      isAddendaModalOpen: false,
      isNoteModalOpen: false,
    },
    {
      showDialog: () => () => ({ isDeleteDialogOpen: true }),
      hideDialog: () => () => ({ isDeleteDialogOpen: false }),
      showAddendaModal: () => () => ({ isAddendaModalOpen: true }),
      hideAddendaModal: () => () => ({ isAddendaModalOpen: false }),
      showNoteModal: () => () => ({ isNoteModalOpen: true }),
      hideNoteModal: () => () => ({ isNoteModalOpen: false }),
    },
  ),
);

export default enhance(Mission);
