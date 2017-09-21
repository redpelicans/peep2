import React from "react";
import PropTypes from "prop-types";
import { isEmpty, map } from "ramda";
import { withStateHandlers } from "recompose";
import styled from "styled-components";
import { LinkButton } from "../widgets";
import Avatar from "../Avatar";

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const PreviewContainer = styled.div`
  width: 300px;
  display: flex;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  border: 1px solid rgba(49, 65, 77, 0.5);
  border-radius: 1px;
`;

export const Title = styled.h3`
  text-transform: capitalize;
  font-size: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  margin-left: 15px;
  color: rgb(67, 75, 89);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Tags = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const Tag = styled.div`
  margin: 3px;
  background-color: #394b59;
  border-radius: 3px;
  font-size: 0.8em;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  color: #394b59;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  company: { _id, name, avatar, tags = [] },
  filterCompanyList
}) => {
  const handleClick = tag => filterCompanyList(`#${tag}`);
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TitleRow>
        <Avatar name={name} color={avatar.color} />
        <Title>{name}</Title>
        {showActions && (
          <Actions>
            <StyledLinkButton
              to={`/company/edit/${_id}`}
              className="pt-small pt-button"
              iconName="pt-icon-edit"
            />
            <Icons className="pt-icon-standard pt-icon-trash" />
          </Actions>
        )}
      </TitleRow>
      {!isEmpty(tags) && (
        <Tags>
          {map(tag => (
            <Tag key={tag} onClick={() => handleClick(tag)}>
              {tag}
            </Tag>
          ))(tags)}
        </Tags>
      )}
    </PreviewContainer>
  );
};

Preview.propTypes = {
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
  company: PropTypes.object.isRequired,
  filterCompanyList: PropTypes.func.isRequired
};

const enhance = withStateHandlers(
  {
    showActions: false
  },
  {
    handleMouseLeave: state => () => ({ showActions: false }),
    handleMouseEnter: state => () => ({ showActions: true })
  }
);

export default enhance(Preview);
