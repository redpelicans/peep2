import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map } from 'ramda';
import styled from 'styled-components';
import Avatar from '../Avatar';

const PreviewContainer = styled.div`
  display: flex;
  padding:0;
  padding-left:15px;
  padding-right:15px;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  background-color: #fff;
  border-bottom: 1px solid #c4c4c4;
  border-left: 1px solid #d3d3d3;
  border-right: 1px solid #d3d3d3;
  border-top: 1px solid #d3d3d3;
  box-shadow: 0 1px 0 rgba(0,0,0,0.07);
  border-radius:1px;
`;

const Title = styled.h3`
  text-transform: capitalize;
  font-size: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
  margin-left: 15px;
  color: rgb(67, 75, 89);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
`;

const Tags = styled.div`
  display: flex;
  margin-top:10px;
`;

const Tag = styled.div`
  margin: 3px;
  background-color: #394b59;
  border-radius:3px;
  font-size:0.8em;
  padding:2px;
  padding-left:4px;
  padding-right:4px;
`;

const Actions = styled.div`
  display:flex;
  justify-content: flex-end;
  flex:1;
  color:#394b59;
`;

const Icons = styled.div`
  margin-left:5px;
  margin-right:5px;
`;

class Preview extends Component {
  state = {
    showActions: false,
  };

  handleMouseEnter = () => {
    this.setState({ showActions: true });
  }

  handleMouseLeave = () => {
    this.setState({ showActions: false });
  }

  render() {
    const { companie: { name, avatar, tags = [] }, filterCompanyList } = this.props;
    const { showActions } = this.state;
    const handleClick = tag => filterCompanyList(`#${tag}`);
    return (
      <PreviewContainer
        className="pt-card pt-elevation-0 pt-interactive"
        onMouseOver={this.handleMouseEnter}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <TitleRow>
          <Avatar
            name={name}
            color={avatar.color}
          />
          <Title>{name}</Title>
          {showActions && <Actions>
            <Icons className="pt-icon-standard pt-icon-edit" />
            <Icons className="pt-icon-standard pt-icon-trash" />
          </Actions>}
        </TitleRow>
        {!isEmpty(tags) &&
          <Tags>
            {map(tag => (<Tag key={tag} onClick={() => handleClick(tag)}>{tag}</Tag>))(tags)}
          </Tags>
        }
      </PreviewContainer>
    );
  }
}

Preview.propTypes = {
  companie: PropTypes.object.isRequired,
  filterCompanyList: PropTypes.func.isRequired,
};

export default Preview;
