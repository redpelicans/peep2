import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { distanceInWords } from 'date-fns';
import { Spacer } from '../widgets';

const StyledDates = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.8em;
`;

const Dates = ({ updatedAt, createdAt }) => {
  const distanceUpdatedAt = updatedAt
    ? distanceInWords(new Date(), updatedAt)
    : undefined;
  const distanceCreatedAt = createdAt
    ? distanceInWords(new Date(), createdAt)
    : undefined;
  return (
    <StyledDates>
      {distanceCreatedAt && <span>{`Created ${distanceCreatedAt} ago`}</span>}
      {distanceCreatedAt &&
        distanceUpdatedAt && (
          <span>
            <Spacer size="2" />
            {' - '}
            <Spacer size="2" />
          </span>
        )}
      {distanceUpdatedAt && <span>{`Updated ${distanceUpdatedAt} ago`}</span>}
    </StyledDates>
  );
};

Dates.propTypes = {
  updatedAt: PropTypes.string,
  createdAt: PropTypes.string,
};

export default Dates;
