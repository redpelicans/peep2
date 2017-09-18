import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { Select } from '@blueprintjs/labs';
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
  min-width:50px;
  min-height:50px;
  background-color:rgb(45,45,45);
  border-radius:100px;
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
`;

const InputElt = styled.div`
  display: flex;
  flex-direction:column;
`;

const InputField = styled.input`
  margin-top:25px;
  margin-right:25px;
`;

class AddCompanie extends Component {
  state = {
    color: 'rgb(25,25,25)',
  }
  render() {
    const { color } = this.state;
    return (
      <Container>
        <Header>
          <TitleRow>
            <FakeAvatar />
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
              <p>Name:</p>
              <InputField className="pt-input" type="text" placeholder="Name" dir="auto" />
            </InputElt>
            <InputElt>
              <p>Website:</p>
              <InputElt className="pt-input" type="text" placeholder="Website" dir="auto" />
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
