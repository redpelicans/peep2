import React from 'react';
import PropTypes from 'prop-types';
import { prop, compose } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
import { withState, withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Dialog, Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import { getCalendar } from '../../selectors/calendar';
import { getWorker, getWorkers } from '../../selectors/people';
import { getWorkerEventsByDate } from '../../selectors/events';
import { Container, Title, Spacer } from '../widgets';
import { defaultValues, getValidationSchema } from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';
import AddOrEdit from './AddOrEdit';

const StyledContainer = styled(Container)`min-width: 300px;`;

const Add = ({
  worker,
  period,
  history,
  cancel,
  events,
  calendar,
  isDialogOpen,
  toggleDialog,
  isSubmitting,
  isValid,
  handleReset,
  handleSubmit,
  dirty,
  ...props
}) => {
  if (!worker) return null;
  const calendarPeriod = [
    startOfDay(subWeeks(period[0], 1)),
    endOfDay(addWeeks(period[1], 1)),
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
                {' '}
                No{' '}
              </Button>
              <Button
                onClick={() => history.goBack()}
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
            <Title>New Event</Title>
          </HeaderLeft>
          <HeaderRight>
            <Button
              form="addEvent"
              type="submit"
              disabled={isSubmitting}
              className="pt-intent-success pt-large"
            >
              Create
            </Button>
            <Spacer />
            <Button
              className="pt-intent-warning pt-large"
              disabled={isSubmitting}
              onClick={cancel(dirty)}
            >
              Cancel
            </Button>
            <Spacer />
            <Button
              className="pt-intent-danger pt-large"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </Button>
          </HeaderRight>
        </Header>
        <AddOrEdit
          worker={worker}
          minDate={minDate}
          maxDate={maxDate}
          calendar={calendar}
          event={event}
          events={events}
          handleSubmit={handleSubmit}
          {...props}
        />
      </div>
    </StyledContainer>
  );
};

Add.propTypes = {
  period: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object,
  cancel: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { history }) => {
  const { location: { state: { from, to, workerId } } = {} } = history;
  return {
    calendar: getCalendar(state),
    worker: getWorker(workerId)(state),
    events: getWorkerEventsByDate(workerId)(state),
    period: [startOfDay(from), endOfDay(to)],
  };
};

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const componentLifecycle = {
  componentWillMount() {
    const { history } = this.props;
    const { location: { state } } = history;
    if (!state) return history.replace(getPathByName('agenda'));
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle(componentLifecycle),
  withFormik({
    handleSubmit: console.log,
    validationSchema: getValidationSchema(),
    mapPropsToValues: ({ worker, period }) => ({
      ...defaultValues,
      period,
      workerId: prop('_id', worker || {}),
    }),
  }),
  withState('isDialogOpen', 'showDialog', false),
  withHandlers({
    cancel: ({ history, showDialog }) => dirty => () => {
      if (!dirty) return history.goBack();
      return showDialog(isDialogOpen => !isDialogOpen);
    },
    toggleDialog: ({ showDialog }) => () =>
      showDialog(isDialogOpen => !isDialogOpen),
  }),
)(Add);
