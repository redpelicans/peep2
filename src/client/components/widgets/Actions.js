import styled from 'styled-components';

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  right: 10px;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 5;
  position: absolute;
  background: linear-gradient(
    to right,
    rgba(48, 64, 77, 0),
    rgba(48, 64, 77, 1)
  );
`;

export default Actions;
