/* eslint-disable react/no-multi-comp */

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Colors } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/labs";
import { shouldUpdate, compose, withHandlers } from "recompose";
import { path, times, map } from "ramda";
import {
  isToday,
  format,
  getDate,
  startOfMonth,
  startOfDay,
  endOfMonth,
  eachDay
} from "date-fns";
import {
  dmy,
  getWorkingDaysInMonth,
  isWorkingDay,
  getCalendarDay
} from "../../utils";
import Avatar, { SMALL } from "../Avatar";
import { fullName, isAdmin, isEqual } from "../../utils/people";
import { isVacation } from "../../utils/events";

const vacationDayBackground = `repeating-linear-gradient(45deg, ${Colors.GREEN1}, ${Colors.GREEN1} 5%, ${Colors.GREEN3} 5%, ${Colors.GREEN3} 10%)`;
const sickLeaveDayBackground = `repeating-linear-gradient(45deg, ${Colors.RED1}, ${Colors.RED1} 5%, ${Colors.RED3} 5%, ${Colors.RED3} 10%)`;
const spareDayBackground = Colors.GRAY1;
const workingDayBackground = Colors.DARK_GRAY4;

const StyledCalendar = styled.div`
  justify-content: center;
  display: grid;
  grid-template-columns: ${({ days }) =>
    ["50px", ...times(() => "35px", days.length)].join(" ")};
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
  const dateLabel = isToday(date) ? "Today" : format(date, "dddd Do of MMMM");
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
  calendar: PropTypes.object
};

const MonthHeader = shouldUpdate(() => false)(({ date, calendar }) => {
  const nbWorkingDays = getWorkingDaysInMonth(calendar, date).length;
  const TooltipContent = (
    <StyledTooltip>
      {`${nbWorkingDays} total working days for ${format(date, "MMMM")}`}
    </StyledTooltip>
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
  calendar: PropTypes.object
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
  worker: PropTypes.object.isRequired
};

const StyledSpareDay = styled.div`background-color: ${spareDayBackground};`;

const SpareDay = shouldUpdate(() => false)(({ onMouseUp }) => {
  const handleMouseUp = e => {
    onMouseUp();
    e.preventDefault();
    e.stopPropagation();
  };
  return <StyledSpareDay onMouseUp={handleMouseUp} />;
});

SpareDay.propTypes = {
  onMouseUp: PropTypes.func.isRequired
};

const StyledWorkingDay = styled.div`
  background-color: ${({ selected }) =>
    selected ? Colors.GREEN5 : workingDayBackground};
`;

const enhanceWorkingDay = compose(
  shouldUpdate((props, nextProps) => nextProps.selected !== props.selected),
  withHandlers({
    handleMouseDown: ({ onMouseDown, worker, date }) => e => {
      onMouseDown(worker, date);
      e.preventDefault();
      e.stopPropagation();
    },
    handleMouseUp: ({ onMouseUp }) => e => {
      onMouseUp();
      e.preventDefault();
      e.stopPropagation();
    },
    handleMouseEnter: ({ onMouseEnter, worker, date }) => e => {
      onMouseEnter(worker, date);
      e.preventDefault();
      e.stopPropagation();
    }
  })
);

const WorkingDay = enhanceWorkingDay(
  ({
    date,
    worker,
    selected,
    readOnly,
    handleMouseEnter,
    handleMouseUp,
    handleMouseDown
  }) => {
    const props =
      (!readOnly && {
        onMouseUp: handleMouseUp,
        onMouseDown: handleMouseDown,
        onMouseEnter: handleMouseEnter
      }) ||
      {};
    return (
      <StyledWorkingDay
        selected={selected}
        onMouseUp={handleMouseUp}
        {...props}
      />
    );
  }
);

WorkingDay.propTypes = {
  date: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  readOnly: PropTypes.bool,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired
};

const betweenDates = (date, first, last) => {
  if (first <= last) return date >= first && date <= last;
  return date >= last && date <= first;
};

const StyledEvent = styled.div`
  background: ${({ event }) =>
    isVacation(event) ? vacationDayBackground : sickLeaveDayBackground};
  cursor: pointer;
  grid-area: ${({ event }) => event.period || "span 2"};
`;

const Event = ({ event }) => {
  return <StyledEvent event={event} />;
};

Event.propTypes = {
  event: PropTypes.object.isRequired
};

const StyledEventDay = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isWorkingDay }) =>
    isWorkingDay ? workingDayBackground : spareDayBackground};
  display: grid;
  grid-auto-flow: columns;
  grid-template-rows: 50%;
  grid-template-areas: "AM" "PM";
`;

const EventDay = ({ events, onMouseUp, isWorkingDay }) => {
  const dayEvents = map(e => <Event key={e._id} event={e} />, events);

  return (
    <StyledEventDay
      isWorkingDay={isWorkingDay}
      events={events}
      onMouseUp={onMouseUp}
    >
      {dayEvents}
    </StyledEventDay>
  );
};

EventDay.propTypes = {
  events: PropTypes.array.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  isWorkingDay: PropTypes.bool.isRequired
};

const Day = ({ calendar, currentWorker, user, events, from, to, ...props }) => {
  const { date, worker, onMouseUp } = props;
  const selected =
    betweenDates(date, from, to) && isEqual(currentWorker, worker);
  const isAWorkingDay = isWorkingDay(calendar, date);
  if (events)
    return (
      <EventDay
        isWorkingDay={isAWorkingDay}
        events={events}
        onMouseUp={onMouseUp}
      />
    );
  if (isAWorkingDay) {
    const newProps =
      isAdmin(user) || isEqual(user, worker)
        ? { selected, ...props }
        : { selected, readOnly: true, ...props };
    return <WorkingDay {...newProps} />;
  }
  const spareDay = getCalendarDay(calendar, date);
  return <SpareDay day={spareDay} onMouseUp={onMouseUp} />;
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  events: PropTypes.array,
  user: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  currentWorker: PropTypes.object,
  onMouseUp: PropTypes.func.isRequired
};

const getWorkerDateEvents = (worker, date, events) =>
  path([worker._id, dmy(date)], events);

class Calendar extends Component {
  state = { mouseDown: false };

  handleMouseDown = (worker, date) => {
    this.setState({ worker, from: date, to: date, mouseDown: true });
  };

  handleMouseUp = () => {
    this.setState({ mouseDown: false }, () => {
      const { worker, from, to } = this.state;
      const { onPeriodSelection } = this.props;
      if (!from) return;
      if (from <= to) return onPeriodSelection(worker, from, to);
      onPeriodSelection(worker, to, from);
    });
  };

  handleMouseEnter = (worker, date) => {
    const { from, mouseDown } = this.state;
    if (from && mouseDown) this.setState({ to: date });
  };

  render() {
    const { from, to, worker: currentWorker } = this.state;
    const { date, calendar, events, workers, user } = this.props;
    const currentDate = date ? startOfDay(date) : startOfDay(new Date());
    const days = eachDay(startOfMonth(date), endOfMonth(date));
    const daysheader = map(
      day => <DayHeader key={dmy(day)} date={day} calendar={calendar} />,
      days
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
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseEnter={this.handleMouseEnter}
          />
        ),
        days
      );
      return [workerHeader, ...workerMonth];
    }, workers);

    return (
      <StyledCalendar days={days} onMouseLeave={this.handleMouseUp}>
        {daysRow}
        {workersMonth}
      </StyledCalendar>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.object,
  calendar: PropTypes.object,
  events: PropTypes.object.isRequired,
  workers: PropTypes.array,
  user: PropTypes.object,
  onPeriodSelection: PropTypes.func.isRequired
};

export default Calendar;
