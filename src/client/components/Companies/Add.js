import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { Select } from '@blueprintjs/labs';
import { compose, join, map, take, split } from 'ramda';
import { connect } from 'react-redux';

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

const ColorOption = styled.div`
  width:100%;
  height:30px;
  background-color:red;
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
  margin-top:25px;
  padding-right:10px;
`;

const InputField = styled.input`
  margin-top:25px;
  margin-right:20px;
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));

class AddCompanie extends Component {
  state = {
    name: '',
    selectedColor: 'rgb(55,55,55)',
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    const { color, name, selectedColor } = this.state;
    console.log('name: ', name);
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
          <Select
            items={[]}
            filterable={false}
            itemRenderer={<ColorOption />}
            onItemSelect={() => console.log(color)}
          >
            <Button text={'Choose a color'} rightIconName="pt-icon-chevron-down" />
          </Select>
          <InputRow>
            <InputElt>
              <p>Name :</p>
              <InputField className="pt-input" onChange={this.handleNameChange}type="text" dir="auto" />
            </InputElt>
            <InputElt>
              <p>Website :</p>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <p>City :</p>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
            <InputElt>
              <p>Country :</p>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <p>Tags :</p>
              <InputField className="pt-input" type="text" dir="auto" />
            </InputElt>
          </InputRow>
          <InputRow>
            <InputElt>
              <p>Note :</p>
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
