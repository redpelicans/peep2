/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { memoize, map, times } from 'ramda';
import { Colors } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  isToday,
  startOfMonth,
  endOfMonth,
  getDay,
  format,
  addDays,
  startOfWeek,
  startOfDay,
} from 'date-fns';
import { dmy, getCalendarDay } from '../../utils';

const StyledCalendar = styled.div``;

class Calendar extends Component {
  state = { mouseDown: false };

  handleMouseDown = date => {
    this.setState({ from: date, to: date, mouseDown: true });
  };

  handleMouseUp = date => {
    this.setState({ to: date, mouseDown: false }, () => {
      const { from } = this.state;
      const { onPeriodSelection } = this.props;
      if (from <= date) return onPeriodSelection(from, date);
      onPeriodSelection(date, from);
    });
  };

  handleMouseEnter = date => {
    const { from, mouseDown } = this.state;
    if (from && mouseDown) this.setState({ to: date });
  };

  render() {
    const { date, ...others } = this.props;
    const { from, to } = this.state;
    const currentDate = date ? startOfDay(date) : startOfDay(new Date());

    return (
      <StyledCalendar>
        <WeekDays />
        <Month
          date={currentDate}
          {...others}
          from={from}
          to={to}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseEnter={this.handleMouseEnter}
        />
      </StyledCalendar>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.object,
  dayComponent: PropTypes.func.isRequired,
  onPeriodSelection: PropTypes.func.isRequired,
  calendar: PropTypes.object,
};

const StyledMonth = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(200px, 300px));
  grid-auto-rows: 200px;
  @media (max-width: 800px) {
    grid-template-columns: minmax(200px, 1fr);
  }
`;

const Month = ({ date, from, to, ...others }) => {
  const betweenDates = (date, first, last) => {
    // eslint-disable-line no-shadow
    if (first <= last) return date >= first && date <= last;
    return date >= last && date <= first;
  };

  const days = memoize(d => {
    const first = startOfMonth(d);
    const last = endOfMonth(d);
    const start = startOfWeek(first);
    const cells = times(id => {
      const current = addDays(start, id);
      const key = dmy(current);
      return (
        <Day
          key={key}
          index={id}
          inBound={current >= first && current <= last}
          selected={betweenDates(current, from, to)}
          date={current}
          {...others}
        />
      );
    }, 35);
    return cells;
  });

  return <StyledMonth>{days(date)}</StyledMonth>;
};

Month.propTypes = {
  date: PropTypes.object.isRequired,
  from: PropTypes.object,
  to: PropTypes.object,
};

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(200px, 1fr));
  justify-items: center;
  @media (max-width: 800px) {
    display: none;
  }
`;

const StyledWeekDay = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const WeekDays = () => {
  const dayNames = times(
    i => format(addDays(startOfWeek(new Date()), i), ['ddd']),
    7,
  );
  const days = map(
    day => <StyledWeekDay key={day}>{day}</StyledWeekDay>,
    dayNames,
  );

  return <StyledContainer>{days}</StyledContainer>;
};
// eslint-disable-next-line no-shadow, no-nested-ternary, max-len
const dateBackground = ({ selected, day }) =>
  selected
    ? '#637D93'
    : day.isSpareDay || day.isWeekendDay ? '2f4b52' : '#434857';
const StyledDay = styled.div`
  overflow: hidden;
  border-style: solid;
  border-color: #5b6062;
  background-color: ${dateBackground};
  border-width: ${props => {
    const bs = '1px';
    if (props.index === 28) return [bs, bs, bs, bs].join(' ');
    if (!(props.index % 7)) return [bs, bs, '0px', bs].join(' ');
    if (props.index > 28) return [bs, bs, bs, '0px'].join(' ');
    return [bs, bs, '0px', '0px'].join(' ');
  }};
`;

const Day = ({
  date,
  index,
  inBound,
  selected,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  dayComponent,
  calendar,
  ...others
}) => {
  const handleMouseDown = e => {
    onMouseDown(date);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseUp = e => {
    onMouseUp(date);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseEnter = e => {
    onMouseEnter(date);
    e.preventDefault();
    e.stopPropagation();
  };

  const DayComponent = dayComponent;
  const day = getCalendarDay(calendar, date);

  return (
    <StyledDay
      selected={selected}
      day={day}
      index={index}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
    >
      <DayHeader date={date} inBound={inBound} day={day} />
      <DayComponent date={date} {...others} />
    </StyledDay>
  );
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  inBound: PropTypes.bool.isRequired,
  dayComponent: PropTypes.func.isRequired,
  calendar: PropTypes.object,
};

const StyledSpareDay = styled.span`
  font-size: 0.9em;
  margin: 5px;
  font-size: 0.9em;
  margin: 5px;
  font-style: italic;
  text-overflow: ellipsis;
`;

const SpareDay = ({ day }) => {
  if (!day.isSpareDay) return null;
  return <StyledSpareDay>{day.label}</StyledSpareDay>;
};

SpareDay.propTypes = {
  day: PropTypes.object,
};

const StyledDayHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const DayHeader = ({ date, inBound, day }) => (
  <StyledDayHeader>
    <DayOfMonth date={date} inBound={inBound} />
    <SpareDay day={day} />
    <Today date={date} />
    <WeekNumber date={date} />
  </StyledDayHeader>
);

DayHeader.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
  day: PropTypes.object,
};

const StyledDayOfMonth = styled.div`
  font-size: 0.9em;
  margin: 5px;
  font-size: 0.9em;
  margin: 5px;
  ${props => !props.inBound && css`color: grey;`};
`;

const DayOfMonth = ({ date, inBound }) => (
  <StyledDayOfMonth inBound={inBound}>{format(date, ['D'])}</StyledDayOfMonth>
);

DayOfMonth.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool,
};

const StyledToday = styled.div`
  font-size: 0.9em;
  padding: 0.2rem;
  margin: 1px;
  color: #cfd2da;
  background-color: ${Colors.GREEN1};
  display: inline-block;
  text-align: center;
  vertical-align: baseline;
  border-radius: 0.25rem;
`;

const Today = ({ date }) => {
  if (!isToday(date)) return <div />;
  return <StyledToday>today</StyledToday>;
};

Today.propTypes = {
  date: PropTypes.object.isRequired,
};

const StyledWeekNumber = styled.div`
  font-size: 0.9em;
  padding: 0.2rem;
  margin: 1px;
  color: #cfd2da;
  background-color: #0275d8;
  display: inline-block;
  text-align: center;
  vertical-align: baseline;
  border-radius: 0.25rem;
`;

const WeekNumber = ({ date }) => {
  if (getDay(date) !== 1) return <div />;
  return <StyledWeekNumber>{format(date, ['W'])}</StyledWeekNumber>;
};

WeekNumber.propTypes = {
  date: PropTypes.object.isRequired,
};

export default Calendar;
