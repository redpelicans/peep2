/* eslint-disable react/no-multi-comp */

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Colors } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/labs";
import { shouldUpdate, compose, withHandlers } from "recompose";
import { times, map } from "ramda";
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

const StyledCalendar = styled.div`
  justify-content: center;
  display: grid;
  grid-template-columns: ${({ days }) =>
    ["100px", ...times(() => "35px", days.length)].join(" ")};
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
  return <div>{`(${nbWorkingDays})`}</div>;
});

MonthHeader.propTypes = {
  date: PropTypes.object,
  calendar: PropTypes.object
};

const StyledWorkerHeader = styled.div``;

const WorkerHeader = shouldUpdate(() => false)(({ worker }) => (
  <StyledWorkerHeader>{worker.firstName}</StyledWorkerHeader>
));

WorkerHeader.propTypes = {
  worker: PropTypes.object.isRequired
};

const StyledSpareDay = styled.div`background-color: ${Colors.GRAY1};`;

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
    selected ? Colors.GREEN5 : Colors.DARK_GRAY4};
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
    handleMouseEnter,
    handleMouseUp,
    handleMouseDown
  }) => (
    <StyledWorkingDay
      selected={selected}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
    />
  )
);

WorkingDay.propTypes = {
  date: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired
};

const betweenDates = (date, first, last) => {
  if (first <= last) return date >= first && date <= last;
  return date >= last && date <= first;
};

const Day = ({
  calendar,
  date,
  worker,
  from,
  to,
  currentWorker,
  onMouseUp,
  ...props
}) => {
  const selected = betweenDates(date, from, to) && currentWorker === worker;
  if (isWorkingDay(calendar, date))
    return (
      <WorkingDay
        selected={selected}
        date={date}
        worker={worker}
        onMouseUp={onMouseUp}
        {...props}
      />
    );
  const spareDay = getCalendarDay(calendar, date);
  return <SpareDay day={spareDay} onMouseUp={onMouseUp} />;
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  worker: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  currentWorker: PropTypes.object,
  onMouseUp: PropTypes.func.isRequired
};

class Calendar extends Component {
  state = { mouseDown: false };

  handleMouseDown = (worker, date) => {
    this.setState({ worker, from: date, to: date, mouseDown: true });
  };

  handleMouseUp = () => {
    this.setState({ mouseDown: false }, () => {
      const { worker, from, to } = this.state;
      const { onPeriodSelection } = this.props;
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
    const { date, calendar, workers = [] } = this.props;
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
            from={from}
            currentWorker={currentWorker}
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
      <StyledCalendar days={days}>
        {daysRow}
        {workersMonth}
      </StyledCalendar>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.object,
  calendar: PropTypes.object,
  workers: PropTypes.array,
  onPeriodSelection: PropTypes.func.isRequired
};

export default Calendar;
