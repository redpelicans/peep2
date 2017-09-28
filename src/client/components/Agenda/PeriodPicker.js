import React from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { format, addHours, subHours } from 'date-fns';
import { Button } from '@blueprintjs/core';

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
}) => {
  const subFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [subHours(from, 12), to]);
  };
  const addFrom = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [addHours(from, 12), to]);
  };
  const subTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, subHours(to, 12)]);
  };
  const addTo = () => {
    setFieldTouched('period', true);
    setFieldValue('period', [from, addHours(to, 12)]);
  };

  const makeButton = ([name, iconName, fn, active]) => (
    <StyledIcon key={name} name={name}>
      <Button iconName={iconName} onClick={fn} disabled={!active} />
    </StyledIcon>
  );
  const buttons = [
    ['addFrom', 'pt-icon-minus', addFrom, addHours(from, 12) < to],
    ['subFrom', 'pt-icon-plus', subFrom, from > minDate],
    ['subTo', 'pt-icon-minus', subTo, to > addHours(from, 12)],
    ['addTo', 'pt-icon-plus', addTo, to < maxDate],
  ];
  return (
    <StyledPeriod>
      <StyledPicker>
        {map(makeButton, buttons)}
        <StyledDate name="from"> {format(from, 'dddd Do of MMMM')} </StyledDate>
        <StyledIcon name="arrow">
          <span className="pt-icon-arrow-right" />
        </StyledIcon>
        <StyledDate name="to"> {format(to, 'dddd Do of MMMM')} </StyledDate>
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
};

export default PeriodPicker;
