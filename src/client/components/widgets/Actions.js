import styled from 'styled-components';

//  background: linear-gradient( to right, rgba(48, 64, 77, 0.5), rgba(48, 64, 77, 1)
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
  background: radial-gradient(
    circle at top right,
    rgba(48, 64, 77, 1),
    rgba(48, 64, 77, 0.3)
  );
`;

export default Actions;
