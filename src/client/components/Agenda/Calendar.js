/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { map, times } from 'ramda';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { dmy } from '../../utils';

const StyledCalendar = styled.div`
`;

class Calendar extends Component {
  state = { mouseDown: false }

  handleMouseDown = date => {
    this.setState({ firstSelectedDate: date, lastSelectedDate: date, mouseDown: true });
  }

  handleMouseUp = date => {
    this.setState({ lastSelectedDate: date, mouseDown: false });
    const { firstSelectedDate } = this.state;
    const { onPeriodSelection } = this.props;
    if (firstSelectedDate <= date) return onPeriodSelection(firstSelectedDate, date);
    onPeriodSelection(date, firstSelectedDate);
  }

  handleMouseEnter = date => {
    const { firstSelectedDate, mouseDown } = this.state;
    if (firstSelectedDate && mouseDown) this.setState({ lastSelectedDate: date });
  }

  render() {
    const { date, ...others } = this.props;
    const { firstSelectedDate, lastSelectedDate } = this.state;
    const currentDate = date ? moment(date) : moment();

    return (
      <StyledCalendar>
        <WeekDays />
        <Month
          date={currentDate}
          {...others}
          firstSelectedDate={firstSelectedDate}
          lastSelectedDate={lastSelectedDate}
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


const Month = ({ date, firstSelectedDate, lastSelectedDate, ...others }) => {
  const StyledMonth = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(200px, 1fr));
    grid-auto-rows: 200px;
    @media (max-width: 800px) {
      grid-template-columns: minmax(200px, 1fr);
    }
  `;

  const betweenDates = (date, first, last) => { // eslint-disable-line no-shadow
    if (first <= last) return date >= first && date <= last;
    return date >= last && date <= first;
  };

  const days = () => {
    const first = date.clone().startOf('month');
    const last = date.clone().endOf('month');
    const current = first.clone().subtract(first.day() + 1, 'days');
    const cells = times(id => {
      current.add(1, 'day');
      const key = dmy(current);
      return (<Day
        key={key}
        index={id}
        inBound={current >= first && current <= last}
        selected={betweenDates(current, firstSelectedDate, lastSelectedDate)}
        date={current.clone()}
        {...others}
      />);
    }, 35);
    return cells;
  };

  return (
    <StyledMonth>
      {days()}
    </StyledMonth>
  );
};

Month.propTypes = {
  date: PropTypes.object.isRequired,
  firstSelectedDate: PropTypes.object,
  lastSelectedDate: PropTypes.object,
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

  const days = map(day => <StyledWeekDay key={day}>{day}</StyledWeekDay>, moment.weekdaysShort());

  return (
    <StyledContainer>
      {days}
    </StyledContainer>
  );
};

const Day = ({ date, index, inBound, selected, onMouseEnter, onMouseDown, onMouseUp, dayComponent, style, ...others }) => {
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
    e.preventDefault();
    onMouseDown(date);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    onMouseUp(date);
  };

  const handleMouseEnter = (e) => {
    e.preventDefault();
    onMouseEnter(date);
  };

  const DayComponent = dayComponent;

  return (
    <StyledDay selected={selected} index={index} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
      <DayHeader date={date} inBound={inBound} />
      <DayComponent date={date} {...others} />
    </StyledDay>
  );
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  inBound: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  dayComponent: PropTypes.func.isRequired,
  style: PropTypes.object,
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
    <StyledDayOfMonth inBound={inBound}>{date.format('D')}</StyledDayOfMonth>
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

  if (date.day() !== 1) return <div />;
  return (
    <StyledWeekNumber>{date.format('w')}</StyledWeekNumber>
  );
};

WeekNumber.propTypes = {
  date: PropTypes.object.isRequired,
};

export default Calendar;
