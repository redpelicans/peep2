import styled from 'styled-components';

// background: radial-gradient( circle at top right, rgba(48, 64, 77, 1), rgba(48, 64, 77, 0.3));
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  right: 10px;
  top: 0px;
  right: 0px;
  z-index: 5;
  position: absolute;
  background: rgba(48, 64, 77, 1);
`;

export default Actions;
