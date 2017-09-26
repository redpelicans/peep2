/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Colors } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/labs';
import {
  onlyUpdateForKeys,
  shouldUpdate,
  compose,
  withHandlers,
} from 'recompose';
import { path, times, map } from 'ramda';
import {
  isToday,
  format,
  getDate,
  startOfMonth,
  startOfDay,
  endOfMonth,
  eachDay,
} from 'date-fns';
import {
  dmy,
  getWorkingDaysInMonth,
  isWorkingDay,
  getCalendarDay,
} from '../../utils';
import Avatar, { SMALL } from '../Avatar';
import { fullName, isAdmin, isEqual } from '../../utils/people';
import { getUnitEvents, isVacation } from '../../utils/events';

const vacationDayBackground = `repeating-linear-gradient(45deg, ${Colors.GREEN1}, ${Colors.GREEN1} 7%, ${Colors.GREEN3} 7%, ${Colors.GREEN3} 14%)`;
const sickLeaveDayBackground = `repeating-linear-gradient(45deg, ${Colors.RED1}, ${Colors.RED1} 7%, ${Colors.RED3} 7%, ${Colors.RED3} 14%)`;
const spareDayBackground = Colors.GRAY1;
const workingDayBackground = Colors.DARK_GRAY4;

const StyledCalendar = styled.div`
  justify-content: center;
  display: grid;
  grid-template-columns: ${({ days }) =>
    ['50px', ...times(() => '35px', days.length)].join(' ')};
  grid-auto-rows: 35px;
  grid-gap: 1px;
  text-align: center;
`;

const StyledDayHeader = styled.div`
  overflow: hidden;
  font-size: 0.8em;
  ${({ today }) => today && css`color: ${Colors.BLUE4};`};
`;

const StyledTooltip = styled.em`font-size: 0.8em;`;

const dmyShouldUpdate = (props, nextProps) =>
  dmy(nextProps.date) !== dmy(props.date);

const DayHeader = shouldUpdate(dmyShouldUpdate)(({ date, calendar }) => {
  const calDay = getCalendarDay(calendar, date);
  const dateLabel = isToday(date) ? 'Today' : format(date, 'dddd Do of MMMM');
  const TooltipContent = (
    <StyledTooltip>
      <p> {calDay.label && calDay.label} </p>
      <p> {dateLabel} </p>
    </StyledTooltip>
  );
  return (
    <StyledDayHeader today={isToday(date)}>
      <div>
        <Tooltip2 className="pt-tooltip-indicator" content={TooltipContent}>
          {getDate(date)}
        </Tooltip2>
      </div>
    </StyledDayHeader>
  );
});

DayHeader.propTypes = {
  date: PropTypes.object.isRequired,
  calendar: PropTypes.object,
};

const MonthHeader = shouldUpdate(() => false)(({ date, calendar }) => {
  const nbWorkingDays = getWorkingDaysInMonth(calendar, date).length;
  const TooltipContent = (
    <StyledTooltip>{`total of ${nbWorkingDays} working days for ${format(
      date,
      'MMMM',
    )}`}</StyledTooltip>
  );

  return (
    <div>
      <Tooltip2 className="pt-tooltip-indicator" content={TooltipContent}>
        {`(${nbWorkingDays})`}
      </Tooltip2>
    </div>
  );
});

MonthHeader.propTypes = {
  date: PropTypes.object,
  calendar: PropTypes.object,
};

const StyledWorkerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAvatar = styled(Avatar)``;

const WorkerHeader = shouldUpdate(() => false)(({ worker }) => (
  <StyledWorkerHeader>
    <StyledAvatar
      name={fullName(worker)}
      showTooltip
      color={worker.avatar.color}
      size={SMALL}
    />
  </StyledWorkerHeader>
));

WorkerHeader.propTypes = {
  worker: PropTypes.object.isRequired,
};

const StyledDay = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isWorkingDay }) =>
    isWorkingDay ? workingDayBackground : spareDayBackground};
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 50%;
  grid-template-areas: 'AM' 'PM';
`;

const StyledSpareDay = styled(StyledDay)`
  background-color: ${spareDayBackground};
`;

const SpareDay = onlyUpdateForKeys(['events'])(({ events, selectPeriod }) => {
  const handleMouseUp = e => {
    selectPeriod && selectPeriod();
    e.preventDefault();
    e.stopPropagation();
  };
  const dayEvents =
    events && map(e => <Event key={e._id} event={e} />, getUnitEvents(events));
  return <StyledSpareDay onMouseUp={handleMouseUp}>{dayEvents}</StyledSpareDay>;
});

SpareDay.propTypes = {
  events: PropTypes.array,
  selectPeriod: PropTypes.func,
};

const StyledWorkingDay = styled(StyledDay)`
  background-color: ${({ selected }) =>
    selected ? Colors.GREEN5 : workingDayBackground};
`;

const enhanceWorkingDay = compose(
  onlyUpdateForKeys(['selected', 'events']),
  withHandlers({
    handleMouseDown: ({ startPeriod, worker, date }) => e => {
      startPeriod && startPeriod(worker, date);
      e.preventDefault();
      e.stopPropagation();
    },
    handleMouseUp: ({ selectPeriod }) => e => {
      selectPeriod && selectPeriod();
      e.preventDefault();
      e.stopPropagation();
    },
    handleMouseEnter: ({ extendPeriod, worker, date }) => e => {
      extendPeriod && extendPeriod(worker, date);
      e.preventDefault();
      e.stopPropagation();
    },
  }),
);

const WorkingDay = enhanceWorkingDay(
  ({
    selected,
    events,
    readOnly,
    handleMouseEnter,
    handleMouseUp,
    handleMouseDown,
  }) => {
    const props =
      (!readOnly && {
        onMouseUp: handleMouseUp,
        onMouseDown: handleMouseDown,
        onMouseEnter: handleMouseEnter,
      }) ||
      {};
    const dayEvents =
      events &&
      map(e => <Event key={e._id} event={e} />, getUnitEvents(events));
    return (
      <StyledWorkingDay
        selected={selected}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {dayEvents}
      </StyledWorkingDay>
    );
  },
);

WorkingDay.propTypes = {
  events: PropTypes.array,
  selected: PropTypes.bool,
  readOnly: PropTypes.bool,
  startPeriod: PropTypes.func,
  selectPeriod: PropTypes.func,
  extendPeriod: PropTypes.func,
};

const betweenDates = (date, first, last) => {
  if (first <= last) return date >= first && date <= last;
  return date >= last && date <= first;
};

const StyledEvent = styled.div`
  background: ${({ event }) =>
    isVacation(event) ? vacationDayBackground : sickLeaveDayBackground};
  cursor: pointer;
  grid-area: ${({ event }) => event.period || 'span 2'};
`;

const Event = ({ event }) => {
  return <StyledEvent event={event} />;
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

const Day = ({ calendar, currentWorker, user, events, from, to, ...props }) => {
  const { date, worker, selectPeriod } = props;
  const selected =
    betweenDates(date, from, to) && isEqual(currentWorker, worker);
  const isAWorkingDay = isWorkingDay(calendar, date);
  if (isAWorkingDay) {
    const newProps =
      user && (isAdmin(user) || isEqual(user, worker))
        ? { selected, events, ...props }
        : { selected, events, readOnly: true, ...props };
    return <WorkingDay {...newProps} />;
  }
  const spareDay = getCalendarDay(calendar, date);
  return (
    <SpareDay day={spareDay} selectPeriod={selectPeriod} events={events} />
  );
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  events: PropTypes.array,
  user: PropTypes.object,
  calendar: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  currentWorker: PropTypes.object,
  selectPeriod: PropTypes.func,
};

const getWorkerDateEvents = (worker, date, events) =>
  path([worker._id, dmy(date)], events);
const getDateEvents = (date, events) => path([dmy(date)], events);

class WorkersCalendar extends Component {
  state = { selecting: false };

  resetPeriod = () => {
    this.setState({ from: undefined, to: undefined, worker: undefined });
  };

  startPeriod = (worker, date) => {
    this.setState({ worker, from: date, to: date, selecting: true });
  };

  selectPeriod = () => {
    this.setState({ selecting: false }, () => {
      const { worker, from, to } = this.state;
      const { onPeriodSelection } = this.props;
      if (!from) return;
      if (from <= to) return onPeriodSelection(worker, from, to);
      onPeriodSelection(worker, to, from);
    });
  };

  extendPeriod = (worker, date) => {
    const { from, selecting } = this.state;
    if (from && selecting) this.setState({ to: date });
  };

  render() {
    const { from, to, worker: currentWorker } = this.state;
    const { date, calendar, events, workers, user } = this.props;
    const currentDate = date ? startOfDay(date) : startOfDay(new Date());
    const days = eachDay(startOfMonth(date), endOfMonth(date));
    const daysheader = map(
      day => <DayHeader key={dmy(day)} date={day} calendar={calendar} />,
      days,
    );
    const monthHeader = (
      <MonthHeader key="MonthHeader" date={currentDate} calendar={calendar} />
    );
    const daysRow = [monthHeader, ...daysheader];
    const workersMonth = map(worker => {
      const workerHeader = <WorkerHeader key={worker._id} worker={worker} />;
      const workerMonth = map(
        d => (
          <Day
            key={dmy(d)}
            date={d}
            calendar={calendar}
            worker={worker}
            user={user}
            from={from}
            currentWorker={currentWorker}
            events={getWorkerDateEvents(worker, d, events)}
            to={to}
            startPeriod={this.startPeriod}
            selectPeriod={this.selectPeriod}
            extendPeriod={this.extendPeriod}
          />
        ),
        days,
      );
      return [workerHeader, ...workerMonth];
    }, workers);

    return (
      <StyledCalendar days={days} onMouseLeave={this.resetPeriod}>
        {daysRow}
        {workersMonth}
      </StyledCalendar>
    );
  }
}

WorkersCalendar.propTypes = {
  date: PropTypes.object,
  calendar: PropTypes.object,
  events: PropTypes.object.isRequired,
  workers: PropTypes.array,
  user: PropTypes.object,
  onPeriodSelection: PropTypes.func.isRequired,
};

export default WorkersCalendar;

export const WorkerCalendar = ({
  startDate,
  endDate,
  from,
  to,
  calendar = {},
  events,
  worker,
}) => {
  if (!worker) return null;
  const days = eachDay(startDate, endDate);
  const daysheader = map(
    day => <DayHeader key={dmy(day)} date={day} calendar={calendar} />,
    days,
  );
  const monthHeader = <div key={-1} />;
  const daysRow = [monthHeader, ...daysheader];
  const workerHeader = <WorkerHeader key={worker._id} worker={worker} />;
  const workerMonth = map(
    d => (
      <Day
        key={dmy(d)}
        date={d}
        calendar={calendar}
        from={from}
        to={to}
        worker={worker}
        currentWorker={worker}
        events={getDateEvents(d, events)}
      />
    ),
    days,
  );

  return (
    <StyledCalendar days={days}>
      {daysRow}
      {[workerHeader, ...workerMonth]}
    </StyledCalendar>
  );
};

WorkerCalendar.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  calendar: PropTypes.object,
  events: PropTypes.object,
  worker: PropTypes.object,
};
