import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, map } from 'ramda';
import Preview from './Preview';
import { EmptySearch } from '../widgets';
import MasonryLayout from '../widgets/MasonryLayout';
import { getClient, getManager, getWorkers } from '../../selectors/missions';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '750px', columns: 2, gutter: 10 },
  { mq: '1025px', columns: 3, gutter: 10 },
  { mq: '1325px', columns: 4, gutter: 10 },
  { mq: '1625px', columns: 5, gutter: 10 },
  { mq: '1925px', columns: 6, gutter: 10 },
  { mq: '2225px', columns: 7, gutter: 10 },
  { mq: '2535px', columns: 8, gutter: 10 },
];

export const List = ({ missions, companies, people, deleteMission }) => (
  <StyledContainer>
    {isEmpty(missions) ? (
      <EmptySearch>
        <span className="pt-icon-large pt-icon-geosearch" />
        No result...
      </EmptySearch>
    ) : (
      <MasonryLayout id="missions" sizes={sizes}>
        {map(mission => {
          const { _id, clientId, managerId, workerIds } = mission;
          const client = getClient(clientId, companies);
          const manager = getManager(managerId, people);
          const workers = workerIds ? getWorkers(people, workerIds) : [];
          return (
            <Preview
              key={_id}
              mission={mission}
              manager={manager}
              workers={workers}
              deleteMission={deleteMission}
              client={client}
            />
          );
        }, missions)}
      </MasonryLayout>
    )}
  </StyledContainer>
);

List.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  missions: PropTypes.array.isRequired,
  deleteMission: PropTypes.func.isRequired,
};

export default List;
