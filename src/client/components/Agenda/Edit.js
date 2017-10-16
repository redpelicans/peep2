import React from 'react';
import PropTypes from 'prop-types';
import { prop, pick, compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withState, withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { Prompt } from 'react-router';
import {
  loadEventGroup,
  updateEventGroup,
  delEventGroup,
} from '../../actions/events';
import { getCalendar } from '../../selectors/calendar';
import { getWorker } from '../../selectors/people';
import { getWorkerEventsByDate, getEventGroup } from '../../selectors/events';
import { Container, Title, Spacer, ModalConfirmation } from '../widgets';
import { getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import AddOrEdit from './AddOrEdit';
import { freeEventsFromPeriod } from '../../utils/events';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Edit = compose(
  withState('isCancelDialogOpen', 'showCancelDialog', false),
  withState('isDeleteDialogOpen', 'showDeleteDialog', false),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    requestCancel: ({ history, showCancelDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showCancelDialog(true);
    },
    requestDeleteEventGroup: ({ showDeleteDialog }) => () =>
      showDeleteDialog(true),
    deleteEventGroup: ({
      history,
      delEventGroup,
      showDeleteDialog,
      event,
    }) => () => {
      showDeleteDialog(false);
      delEventGroup(event);
      history.goBack();
    },
  }),
)(
  ({
    dirty,
    isCancelDialogOpen,
    isDeleteDialogOpen,
    cancel,
    showCancelDialog,
    showDeleteDialog,
    requestDeleteEventGroup,
    deleteEventGroup,
    isSubmitting,
    worker,
    event,
    requestCancel,
    events,
    calendar,
    ...props
  }) => {
    const calendarPeriod = [
      startOfDay(subWeeks(event.from, 1)),
      endOfDay(addWeeks(event.to, 1)),
    ];
    const [minDate, maxDate] = calendarPeriod;
    return (
      <StyledContainer>
        <div>
          <Prompt
            when={!isCancelDialogOpen && dirty && !isSubmitting}
            message="Would you like to cancel this form ?"
          />

          <ModalConfirmation
            isOpen={isDeleteDialogOpen}
            title="Would you like to delete this event group ?"
            reject={() => showDeleteDialog(false)}
            accept={deleteEventGroup}
          />
          <ModalConfirmation
            isOpen={isCancelDialogOpen}
            title="Would you like to cancel this form ?"
            reject={() => showCancelDialog(false)}
            accept={cancel}
          />
          <Header>
            <HeaderLeft>
              <div className="pt-icon-standard pt-icon-calendar" />
              <Spacer />
              <Title>Edit Event</Title>
            </HeaderLeft>
            <HeaderRight>
              <Button
                form="AddOrEdit"
                type="submit"
                disabled={isSubmitting || !dirty}
                className="pt-intent-success pt-large"
              >
                Update
              </Button>
              <Spacer />
              <Button
                className="pt-intent-danger pt-large"
                onClick={requestDeleteEventGroup}
              >
                Delete
              </Button>
              <Spacer />
              <Button
                onClick={requestCancel(dirty)}
                className="pt-intent-warning pt-large"
              >
                Cancel
              </Button>
              <Spacer />
            </HeaderRight>
          </Header>
          <AddOrEdit
            worker={worker}
            minDate={minDate}
            maxDate={maxDate}
            calendar={calendar}
            events={events}
            {...props}
          />
        </div>
      </StyledContainer>
    );
  },
);

Edit.propTypes = {
  event: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object,
  worker: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
};

const FormikEdit = ({
  event,
  worker,
  history,
  updateEventGroup,
  events,
  calendar,
  ...props
}) => {
  if (!event || !worker) return <div />;
  return (
    <Formik
      initialValues={{
        ...pick(['status', 'type', 'description'], event),
        period: [event.from, event.to],
        workerId: prop('_id', worker),
      }}
      validationSchema={getValidationSchema()}
      onSubmit={({ type, workerId, status, period, description }) => {
        const [from, to] = period;
        const newEvents = freeEventsFromPeriod({ from, to, events, calendar });
        updateEventGroup({
          previous: event,
          next: {
            type,
            workerId,
            status,
            from,
            to,
            description,
            events: newEvents,
          },
        });
        history.goBack();
      }}
      render={({ ...others }) => (
        <Edit
          event={event}
          worker={worker}
          calendar={calendar}
          events={events}
          history={history}
          {...props}
          {...others}
        />
      )}
    />
  );
};

FormikEdit.propTypes = {
  event: PropTypes.object,
  calendar: PropTypes.object,
  events: PropTypes.object,
  worker: PropTypes.object,
  loadEventGroup: PropTypes.func.isRequired,
  updateEventGroup: PropTypes.func.isRequired,
  delEventGroup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  const { match: { params: { id: groupId } = {} } } = props;
  const event = getEventGroup(groupId)(state);
  if (!event) return {};
  const { workerId } = event;
  return {
    event,
    calendar: getCalendar(state),
    worker: getWorker(workerId)(state),
    events: getWorkerEventsByDate(workerId, groupId)(state),
  };
};

const actions = { loadEventGroup, updateEventGroup, delEventGroup };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const componentLifecycle = {
  componentWillMount() {
    const { match } = this.props;
    const { params: { id } = {} } = match;
    this.props.loadEventGroup({ groupId: id });
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle(componentLifecycle),
)(FormikEdit);
