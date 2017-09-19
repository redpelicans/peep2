import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { compose, join, map, take, split } from 'ramda';
import { connect } from 'react-redux';
import { randomColor } from '../../utils/colors';

const Container = styled.div`
  display:flex;
  flex-direction:column;
  position:relative;
  min-width:300px;
  padding: 20px;
  margin:25px;
  background-color: #394b59;
  border-radius: 2px;
`;

const Header = styled.div`
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: center;
  width:100%;
`;

const Buttons = styled.div`
  display:flex;
`;

const ButtonElt = styled(Button)`
  height:30px;
  margin-left:15px;
  margin-right:15px;
`;

const FakeAvatar = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  font-size:2em;
  min-width:50px;
  min-height:50px;
  border-radius:100px;
  background-color: ${props => props.color};
`;

const TitleRow = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  color:white;
  margin:0;
  margin-left:25px;
`;

const Form = styled.div`
  display:flex;
  flex-direction:column;
  margin-top:25px;
  width:100%;
`;

const ColorSelector = styled.div`
  margin-bottom:15px;
  margin-top:15px;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width:100%;
`;

const InputElt = styled.div`
  display: flex;
  flex-direction:column;
  flex:1;
  margin-top:15px;
  padding-right:10px;
`;

const InputField = styled.input`
  margin-top:20px;
  margin-right:20px;
  box-shadow: 0 0 0 0 rgba(19, 124, 189, 0),
  0 0 0 0 rgba(19, 124, 189, 0),
  0 0 0 0 rgba(19, 124, 189, 0),
  inset 0 0 0 1px rgba(16, 22, 26, 0.3),
  inset 0 1px 1px rgba(16, 22, 26, 0.4);
  background: rgba(16, 22, 26, 0.3);
  color: #f5f8fa;
`;

const InputText = styled.p`
  margin:0;
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));

class AddCompanie extends Component {
  state = {
    name: '',
    selectedColor: randomColor(),
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    const { name, selectedColor } = this.state;
    return (
      <Container>
        <Header>
          <TitleRow>
            <FakeAvatar color={selectedColor}>
              { initials(name) }
            </FakeAvatar>
            <Title>New Companie</Title>
          </TitleRow>
          <Buttons>
            <ButtonElt className="pt-intent-success">Create</ButtonElt>
            <Link to="/companies">
              <ButtonElt className="pt-intent-warning">Cancel</ButtonElt>
            </Link>
          </Buttons>
        </Header>
        <Form>
          <ColorSelector className="pt-select">
            <select>
              <option selected>Choose a color...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </ColorSelector>
          <InputRow>
            <InputElt>
              <InputText>Name :</InputText>
              <InputField className="pt-input" onChange={this.handleNameChange}type="text" dir="auto" />
            </InputElt>
            <InputElt>
              <InputText>Website :</InputText>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <InputText>City :</InputText>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
            <InputElt>
              <InputText>Country :</InputText>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <InputText>Tags :</InputText>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <InputText>Note :</InputText>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  countries: state.countries.data,
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddCompanie);
