import styled from 'styled-components';

export const CompagnyForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-auto-columns: minmax(100px, auto);
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 'Types Name Website' 'Zipcode Street Street' 'Country City City' 'Tags Tags Tags' 'Notes Notes Notes';
`;
