import React from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@blueprintjs/core';
import { isPreviousHalfDayFree, isNextHalfDayFree } from '../../utils/events';

const StyledPeriod = styled.div`
  justify-content: center;
  grid-area: period;
  display: flex;
  align-items: center;
  font-size: 1.2em;
`;

const StyledPicker = styled.div`
  display: grid;
  grid-template-areas: 'subFrom from addFrom' 'null1 arrow null2'
    'subTo to addTo';
  grid-template-columns: auto auto 1fr auto 1fr auto auto;
  grid-template-rows: auto;
  @media (min-width: 900px) {
    grid-template-columns: 30px 30px 300px 50px 300px 30px 30px;
    grid-template-areas: 'subFrom addFrom from arrow to subTo addTo';
  }
`;

const StyledDate = styled.div`
  grid-area: ${prop => prop.name};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled.div`
  grid-area: ${prop => prop.name};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
`;

const PeriodPicker = ({
  from,
  to,
  minDate,
  maxDate,
  setFieldTouched,
  setFieldValue,
  events,
}) => {
  const subFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [subDays(from, 0.5), to]);
  };
  const addFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [addDays(from, 0.5), to]);
  };
  const subTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, subDays(to, 0.5)]);
  };
  const addTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, addDays(to, 0.5)]);
  };

  const makeButton = ([name, icon, fn, active]) => (
    <StyledIcon key={name} name={name}>
      <Button icon={icon} onClick={fn} disabled={!active} />
    </StyledIcon>
  );

  const buttons = [
    ['addFrom', 'small-minus', addFrom, addDays(from, 0.5) < to],
    [
      'subFrom',
      'small-plus',
      subFrom,
      from > minDate && isPreviousHalfDayFree(events, from),
    ],
    ['subTo', 'small-minus', subTo, to > addDays(from, 0.5)],
    [
      'addTo',
      'small-plus',
      addTo,
      to < maxDate && isNextHalfDayFree(events, to),
    ],
  ];
  return (
    <StyledPeriod>
      <StyledPicker>
        {map(makeButton, buttons)}
        {from && (
          <StyledDate name="from">
            {' '}
            {format(from, 'dddd Do of MMMM')}{' '}
          </StyledDate>
        )}
        <StyledIcon name="arrow">
          <span className="pt-icon-arrow-right" />
        </StyledIcon>
        {to && (
          <StyledDate name="to"> {format(to, 'dddd Do of MMMM')} </StyledDate>
        )}
      </StyledPicker>
    </StyledPeriod>
  );
};

PeriodPicker.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  events: PropTypes.object,
};

export default PeriodPicker;
