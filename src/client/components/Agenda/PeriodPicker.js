import React from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@blueprintjs/core';

const StyledPeriod = styled.div`
  grid-area: period;
  display: flex;
  align-items: center;
  font-size: 1.2em;
`;

const StyledPicker = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: 'subFrom from addFrom' 'null1 arrow null2'
    'subTo to addTo';
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto;
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
  field,
  from,
  to,
  minDate,
  maxDate,
  setFieldTouched,
  setFieldValue,
}) => {
  const subFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [subDays(from, 1), to]);
  };
  const addFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [addDays(from, 1), to]);
  };
  const subTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, subDays(to, 1)]);
  };
  const addTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, addDays(to, 1)]);
  };

  const makeButton = ([name, iconName, fn, active]) => (
    <StyledIcon key={name} name={name}>
      <Button iconName={iconName} onClick={fn} disabled={!active} />
    </StyledIcon>
  );
  const buttons = [
    ['addFrom', 'pt-icon-plus', addFrom, from < to],
    ['addTo', 'pt-icon-plus', addTo, to < maxDate],
    ['subFrom', 'pt-icon-minus', subFrom, from > minDate],
    ['subTo', 'pt-icon-minus', subTo, to > from],
  ];
  return (
    <StyledPeriod>
      <StyledPicker>
        {map(makeButton, buttons)}
        <StyledDate name="from"> {format(from, 'dddd Do of MMMM')} </StyledDate>
        <StyledIcon name="arrow">
          {' '}
          <span className="pt-icon-arrow-down" />{' '}
        </StyledIcon>
        <StyledDate name="to"> {format(to, 'dddd Do of MMMM')} </StyledDate>
      </StyledPicker>
    </StyledPeriod>
  );
};

PeriodPicker.propTypes = {
  field: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  maxDate: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
};

export default PeriodPicker;
