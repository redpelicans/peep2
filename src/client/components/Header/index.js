import styled from 'styled-components';

export const HeaderLeft = styled.div`
  display: flex;
  font-size: 1.5em;
  justify-content: flex-start;
  align-items: flex-end;
  margin-right:25px;
  flex: 1;
`;

export const HeaderRight = styled.div`
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  margin-left:25px;
  flex: 1;
`;

export const Header = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  padding-bottom: 2em;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1.5px solid rgb(49,65,77);
  grid-row: 2;
`;

export const TimeElt = styled.div`
  font-size: '.7rem';
  font-style: 'italic';
  display: 'block';
  float: 'right';
`;
