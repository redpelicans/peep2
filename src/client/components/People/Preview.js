import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, map } from "ramda";
import styled from "styled-components";
import { withStateHandlers } from "recompose";
import { LinkButton } from "../widgets";
import Avatar from "../Avatar";

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

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledInfos = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

export const NameLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
  font-size: 0.9rem;
  font-weight: bold;
`;

export const CompanyLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
  font-size: 0.8rem;
`;

const EditIcon = styled(Link)``;

const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  person: { _id, name, avatar, tags = [] },
  company = {},
  onTagClick,
  handleDeletePeople
}) => {
  const handleClick = tag => onTagClick(`#${tag}`);
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TitleRow>
        <Avatar name={name} color={avatar.color} />
        <StyledInfos>
          <NameLink to={`/people/${_id}`}>{name}</NameLink>
          <CompanyLink to={`/company/${company._id}`}>
            {company.name}
          </CompanyLink>
        </StyledInfos>
        {showActions && (
          <Actions>
            <StyledLinkButton
              to={`/people/edit/${_id}`}
              className="pt-small pt-button"
              iconName="pt-icon-edit"
            />
            <Icons
              className="pt-icon-standard pt-icon-trash"
              onClick={() => handleDeletePeople(_id)}
            />
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
  person: PropTypes.object.isRequired,
  company: PropTypes.object,
  onTagClick: PropTypes.func.isRequired,
  deletePeople: PropTypes.func.isRequired
};

const enhance = withStateHandlers(
  {
    showActions: false
  },
  {
    handleMouseLeave: state => () => ({ showActions: false }),
    handleMouseEnter: state => () => ({ showActions: true }),
    handleDeletePeople: ({ deletePeople, _id }) => () => deletePeople(_id)
  }
);

export default enhance(Preview);
