import React from 'react';
import PropTypes from 'prop-types';
import { prop, pick, compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withState, withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button, Dialog } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import { loadEventGroup, updateEventGroup } from '../../actions/events';
import { getCalendar } from '../../selectors/calendar';
import { getWorker } from '../../selectors/people';
import { getWorkerEventsByDate, getEventGroup } from '../../selectors/events';
import { Container, Title, Spacer } from '../widgets';
import { getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import AddOrEdit from './AddOrEdit';
import { freeEventsFromPeriod } from '../../utils/events';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Edit = ({
  dirty,
  isDialogOpen,
  leave,
  toggleDialog,
  isSubmitting,
  worker,
  event,
  cancel,
  events,
  calendar,
  ...props
}) => {
  if (!event) return null;
  const calendarPeriod = [
    startOfDay(subWeeks(event.from, 1)),
    endOfDay(addWeeks(event.to, 1)),
  ];
  const [minDate, maxDate] = calendarPeriod;
  return (
    <StyledContainer>
      <div>
        <Dialog isOpen={isDialogOpen} className="pt-dark">
          <div className="pt-dialog-body">
            Would you like to cancel this form?
          </div>
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button
                onClick={() => toggleDialog()}
                className="pt-intent-warning pt-large"
              >
                No
              </Button>
              <Button
                onClick={() => leave()}
                className="pt-intent-success pt-large"
              >
                {' '}
                Yes{' '}
              </Button>
            </div>
          </div>
        </Dialog>

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
            <Button className="pt-intent-danger pt-large">Delete</Button>
            <Spacer />
            <Button
              onClick={cancel(dirty)}
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
          cancel={cancel}
          {...props}
        />
      </div>
    </StyledContainer>
  );
};

Edit.propTypes = {
  cancel: PropTypes.func.isRequired,
  leave: PropTypes.func.isRequired,
  event: PropTypes.object,
  calendar: PropTypes.object,
  events: PropTypes.object,
  worker: PropTypes.object.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
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

const actions = { loadEventGroup, updateEventGroup };
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
  withFormik({
    handleSubmit: (
      { type, workerId, status, period, description },
      { props },
    ) => {
      const { event, calendar, events, updateEventGroup, history } = props;
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
    },
    validationSchema: getValidationSchema(),
    mapPropsToValues: ({ event = {}, worker = {} }) => ({
      ...pick(['status', 'type', 'description'], event),
      period: [event.from, event.to],
      workerId: prop('_id', worker),
    }),
  }),
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    leave: ({ history }) => () => history.goBack(),
    cancel: ({ history, showDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showDialog(isDialogOpen => !isDialogOpen);
    },
    toggleDialog: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
)(Edit);
