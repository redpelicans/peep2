/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { memoize, map, times } from 'ramda';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { startOfMonth, endOfMonth, getDay, format, addDays, startOfWeek, startOfDay } from 'date-fns';
// import { onlyUpdateForKeys } from 'recompose';
import { dmy } from '../../utils';

const StyledCalendar = styled.div`
`;

class Calendar extends Component {
  state = { mouseDown: false }

  handleMouseDown = date => {
    this.setState({ from: date, to: date, mouseDown: true });
  }

  handleMouseUp = date => {
    this.setState({ to: date, mouseDown: false }, () => {
      const { from } = this.state;
      const { onPeriodSelection } = this.props;
      if (from <= date) return onPeriodSelection(from, date);
      onPeriodSelection(date, from);
    });
  }

  handleMouseEnter = date => {
    const { from, mouseDown } = this.state;
    if (from && mouseDown) this.setState({ to: date });
  }

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
};


const Month = ({ date, from, to, ...others }) => {
  const StyledMonth = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(200px, 300px));
    grid-auto-rows: 200px;
    @media (max-width: 800px) {
      grid-template-columns: minmax(200px, 1fr);
    }
  `;

  const betweenDates = (date, first, last) => { // eslint-disable-line no-shadow
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
      return (<Day
        key={key}
        index={id}
        inBound={current >= first && current <= last}
        selected={betweenDates(current, from, to)}
        date={current}
        {...others}
      />);
    }, 35);
    return cells;
  });

  return (
    <StyledMonth>
      {days(date)}
    </StyledMonth>
  );
};

Month.propTypes = {
  date: PropTypes.object.isRequired,
  from: PropTypes.object,
  to: PropTypes.object,
};

const WeekDays = () => {
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

  const dayNames = times(i => format(addDays(startOfWeek(new Date()), i), ['ddd']), 7);
  const days = map(day => <StyledWeekDay key={day}>{day}</StyledWeekDay>, dayNames);

  return (
    <StyledContainer>
      {days}
    </StyledContainer>
  );
};
// const Day = ({ date, index, inBound, selected, onMouseEnter, onMouseDown, onMouseUp, dayComponent, ...others }) => {
//   const StyledDay = styled.div`
//     overflow: hidden;
//     border-style: solid;
//     border-color: #5b6062;
//     background-color: ${props => props.selected ? '#637D93' : '#434857'};
//     border-width: ${props => {
//     const bs = '1px';
//     if (props.index === 28) return [bs, bs, bs, bs].join(' ');
//     if (!(props.index % 7)) return [bs, bs, '0px', bs].join(' ');
//     if (props.index > 28) return [bs, bs, bs, '0px'].join(' ');
//     return [bs, bs, '0px', '0px'].join(' ');
//   }};
//   `;
//
//   const handleMouseDown = (e) => {
//     onMouseDown(date);
//     e.stopPropagation();
//   };
//
//   const handleMouseUp = (e) => {
//     onMouseUp(date);
//     e.stopPropagation();
//   };
//
//   const handleMouseEnter = (e) => {
//     onMouseEnter(date);
//     e.stopPropagation();
//   };
//
//   const DayComponent = dayComponent;
//
//   return (
//     <StyledDay selected={selected} index={index} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
//       <DayHeader date={date} inBound={inBound} />
//       <DayComponent date={date} {...others} />
//     </StyledDay>
//   );
// };
//

const Day = ({ date, index, selected, onMouseEnter, onMouseDown, onMouseUp, inBound }) => {
  const StyledDay = styled.div`
    overflow: hidden;
    border-style: solid;
    border-color: #5b6062;
    background-color: ${props => props.selected ? '#637D93' : '#434857'};
    border-width: ${props => {
    const bs = '1px';
    if (props.index === 28) return [bs, bs, bs, bs].join(' ');
    if (!(props.index % 7)) return [bs, bs, '0px', bs].join(' ');
    if (props.index > 28) return [bs, bs, bs, '0px'].join(' ');
    return [bs, bs, '0px', '0px'].join(' ');
  }};
  `;

  const handleMouseDown = (e) => {
    onMouseDown(date);
    e.stopPropagation();
  };

  const handleMouseUp = (e) => {
    onMouseUp(date);
    e.stopPropagation();
  };

  const handleMouseEnter = (e) => {
    onMouseEnter(date);
    e.stopPropagation();
  };


  return (
    <StyledDay selected={selected} index={index} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
      <DayHeader date={date} inBound={inBound} />
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
};

class DayHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return dmy(nextProps.date) !== dmy(this.props.date) || nextProps.inBound !== this.props.inBound;
  }

  render() {
    const { date, inBound } = this.props;
    const StyledDayHeader = styled.div`
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    `;

    return (
      <StyledDayHeader>
        <DayOfMonth date={date} inBound={inBound} />
        <WeekNumber date={date} />
      </StyledDayHeader>
    );
  }
}

DayHeader.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
};

const DayOfMonth = ({ date, inBound }) => {
  const StyledDayOfMonth = styled.div`
    font-size: 0.9em;
    margin: 5px;
    font-size: 0.9em;
    margin: 5px;
    ${props => !props.inBound && css`color:  grey;`};
  `;
  return (
    <StyledDayOfMonth inBound={inBound}>{format(date, ['D'])}</StyledDayOfMonth>
  );
};

DayOfMonth.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool,
};

const WeekNumber = ({ date }) => {
  const StyledWeekNumber = styled.div`
    font-size: 0.9em;
    padding: .2rem;
    margin: 1px;
    color: #cfd2da;
    background-color: #0275d8;
    display: inline-block;
    text-align: center;
    vertical-align: baseline;
    border-radius: .25rem;
  `;

  if (getDay(date) !== 1) return <div />;
  return (
    <StyledWeekNumber>{format(date, ['W'])}</StyledWeekNumber>
  );
};

WeekNumber.propTypes = {
  date: PropTypes.object.isRequired,
};

export default Calendar;
