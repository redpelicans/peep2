import React from 'react';
import PropTypes from 'prop-types';
import { pick, compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { loadEvents } from '../../actions/events';
import { getCalendar } from '../../selectors/calendar';
import { getWorkers } from '../../selectors/people';
import { getEventsByWorkerDate, getEventGroup } from '../../selectors/events';
import { Container, Title, Spacer } from '../widgets';
import { getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Edit = ({ event, cancel, editEvent, workers, events, calendar }) => {
  if (!event) return null;
  const worker = workers[event.workerId];
  const workerEvents = events[worker._id];
  const selectedPeriod = [event.from, event.to];
  const calendarPeriod = [
    startOfDay(subWeeks(event.from, 1)),
    endOfDay(addWeeks(event.to, 1)),
  ];
  const [minDate, maxDate] = calendarPeriod;
  const initialValues = {
    ...pick(['status', 'type', 'description'], event),
    period: selectedPeriod,
    workerId: worker._id,
  };
  return (
    <StyledContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        isInitialValid={({ validationSchema, initialValues }) =>
          validationSchema.isValid(initialValues)}
        onSubmit={editEvent}
        render={({ isSubmitting, isValid, ...props }) => {
          return (
            <div>
              <Header>
                <HeaderLeft>
                  <div className="pt-icon-standard pt-icon-calendar" />
                  <Spacer />
                  <Title>New Event</Title>
                </HeaderLeft>
                <HeaderRight>
                  <Button
                    form="editEvent"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="pt-intent-success pt-large"
                  >
                    Update
                  </Button>
                  <Spacer />
                  <Button className="pt-intent-danger pt-large">Delete</Button>
                  <Spacer />
                  <Button className="pt-intent-warning pt-large">Cancel</Button>
                  <Spacer />
                </HeaderRight>
              </Header>
              <AddOrEdit
                worker={worker}
                minDate={minDate}
                maxDate={maxDate}
                calendar={calendar}
                event={event}
                events={workerEvents}
                cancel={cancel}
                {...props}
              />
            </div>
          );
        }}
      />
    </StyledContainer>
  );
};

Edit.propTypes = {
  cancel: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  event: PropTypes.object,
  workers: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  const { match: { params: { id } = {} } } = props;
  return {
    calendar: getCalendar(state),
    workers: getWorkers(state),
    events: getEventsByWorkerDate(state),
    event: getEventGroup(id)(state),
  };
};

const actions = { loadEvents };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const componentLifecycle = {
  componentWillMount() {
    const { match } = this.props;
    const { params: { id } = {} } = match;
    this.props.loadEvents({ groupId: id });
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle(componentLifecycle),
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    editEvent: () => values => console.log(values),
  }),
)(Edit);
