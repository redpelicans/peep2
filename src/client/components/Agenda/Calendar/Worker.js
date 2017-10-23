import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { addHours, subHours, startOfDay, endOfDay, eachDay } from 'date-fns';
import { times, map, path, filter } from 'ramda';
import { dmy, isWorkingDay } from '../../../utils';
import {
  EVENT_PM,
  EVENT_AM,
  isFullDayEvent,
  isHalfDayEvent,
  isVacation,
} from '../../../utils/events';
import { DayHeader, WorkerHeader } from './Workers';
import {
  selectedBackground,
  vacationDayBackground,
  sickLeaveDayBackground,
  spareDayBackground,
  workingDayBackground,
} from './utils';

const StyledCalendar = styled.div`
  justify-content: center;
  display: grid;
  grid-template-columns: ${({ days }) =>
    ['50px', ...times(() => '35px', days.length)].join(' ')};
  grid-auto-rows: 30px 35px 10px;
  grid-gap: 1px;
  grid-row-gap: 5px;
  text-align: center;
`;

const StyledEvent = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ event }) =>
    isVacation(event)
      ? vacationDayBackground(event)
      : sickLeaveDayBackground(event)};
`;

const Event = ({ event }) => <StyledEvent event={event} />;

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

const StyledHalfDay = styled.div`grid-column: ${({ period }) => period};`;

const HalfDay = ({ period, events }) => (
  <StyledHalfDay period={period}>
    {events && events[0] && <Event event={events[0]} />}
  </StyledHalfDay>
);

HalfDay.propTypes = {
  period: PropTypes.string.isRequired,
  events: PropTypes.array,
};

const StyledDay = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isWorkingDay }) =>
    isWorkingDay ? workingDayBackground : spareDayBackground};
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 100%;
  grid-template-columns: 50% 50%;
  grid-template-areas: 'AM PM';
`;

const getHalfDayEvents = (period, events) =>
  events && filter(e => isFullDayEvent(e) || isHalfDayEvent(period, e), events);

const Day = ({ events, calendar, ...props }) => {
  const { date } = props;
  return (
    <StyledDay isWorkingDay={isWorkingDay(calendar, date)}>
      <HalfDay
        period={EVENT_AM}
        {...props}
        events={getHalfDayEvents(EVENT_AM, events)}
      />
      <HalfDay
        period={EVENT_PM}
        {...props}
        events={getHalfDayEvents(EVENT_PM, events)}
      />
    </StyledDay>
  );
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.array,
  calendar: PropTypes.object.isRequired,
};

const getSelectDaybackground = ({ selected, type, isWorkingDay }) => {
  if (!selected) return workingDayBackground;
  if (!isWorkingDay) return selectedBackground;
  return type === 'vacation'
    ? vacationDayBackground()
    : sickLeaveDayBackground();
};

const StyledHalfDaySelected = styled.div`
  grid-column: ${({ period }) => period};
  background: ${getSelectDaybackground};
`;

const StyledSelectedDay = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 100%;
  grid-template-columns: 50% 50%;
  grid-template-areas: 'AM PM';
`;

const betweenDates = (startPeriod, endPeriod, from, to) => {
  return startPeriod >= from && endPeriod <= to;
};

const SelectedDay = ({ date, from, to, type, isWorkingDay }) => {
  return (
    <StyledSelectedDay>
      <StyledHalfDaySelected
        period={EVENT_AM}
        type={type}
        isWorkingDay={isWorkingDay}
        selected={betweenDates(
          startOfDay(date),
          subHours(endOfDay(date), 12),
          from,
          to,
        )}
      />
      <StyledHalfDaySelected
        period={EVENT_PM}
        type={type}
        isWorkingDay={isWorkingDay}
        selected={betweenDates(addHours(date, 12), endOfDay(date), from, to)}
      />
    </StyledSelectedDay>
  );
};

SelectedDay.propTypes = {
  date: PropTypes.object.isRequired,
  from: PropTypes.object,
  to: PropTypes.object,
  type: PropTypes.string.isRequired,
  isWorkingDay: PropTypes.bool.isRequired,
};

const getDateEvents = (date, events) => path([dmy(date)], events);

const WorkerCalendar = ({
  startDate,
  endDate,
  from,
  to,
  calendar = {},
  events,
  worker,
  className,
  type,
}) => {
  if (!worker) return null;
  const days = eachDay(startDate, endDate);
  const daysheader = map(
    day => <DayHeader key={dmy(day)} date={day} calendar={calendar} />,
    days,
  );
  const fakeHeader = <div key={-1} />;
  const selectedDays = map(
    d => (
      <SelectedDay
        type={type}
        isWorkingDay={isWorkingDay(calendar, d)}
        key={dmy(d)}
        date={d}
        from={from}
        to={to}
      />
    ),
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
        events={getDateEvents(d, events)}
      />
    ),
    days,
  );

  return (
    <StyledCalendar days={days} className={className}>
      {daysRow}
      {[workerHeader, ...workerMonth]}
      {[fakeHeader, ...selectedDays]}
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
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default WorkerCalendar;
