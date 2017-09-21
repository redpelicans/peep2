import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 'Types Name Website' 'Street Zipcode  Zipcode' 'City  Country  Country' 'Tags Tags Tags' 'Notes Notes Notes';
`;
