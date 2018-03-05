import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Intent, Icon, Colors } from '@blueprintjs/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import Avatar from '../Avatar';
import { getPerson } from '../../selectors/people';
import { getCompany } from '../../selectors/companies';
import { getPathByName } from '../../routes';
import { ALERT, DANGER, SUCCESS, EVTX_ERROR } from '../../actions/message';
import {
  COMPANY_DELETED,
  COMPANY_ADDED,
  COMPANY_UPDATED,
} from '../../actions/companies';
import {
  PEOPLE_DELETED,
  PEOPLE_ADDED,
  PEOPLE_UPDATED,
} from '../../actions/people';
import './message.css';
import Toast from './toaster';

const ICON_COMPANY = 'pt-icon-home';
const ICON_PEOPLE = 'pt-icon-people';
const ICON_WARNING = 'pt-icon-warning-sign';

const COMPANY = 'company';
const PERSON = 'person';

const ToasterCreator = (message, author, entity) => {
  const { entityId, actionType, authorId } = message;
  switch (actionType) {
    case COMPANY_ADDED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        authorAvatar: author.avatar ? author.avatar : undefined,
        entityAvatar: entity.avatar ? entity.avatar : undefined,
        entityPath: getPathByName(COMPANY, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' successfuly created',
      };
    case COMPANY_UPDATED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        authorAvatar: author.avatar ? author.avatar : undefined,
        entityAvatar: entity.avatar ? entity.avatar : undefined,
        entityPath: getPathByName(COMPANY, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' successfuly updated',
      };
    case COMPANY_DELETED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        authorAvatar: author.avatar ? author.avatar : undefined,
        authorPath: getPathByName(PERSON, authorId),
        entityName: 'company',
        authorName: author ? author.name : '',
        content: ' successfuly deleted',
      };
    case PEOPLE_ADDED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        authorAvatar: author.avatar ? author.avatar : undefined,
        entityAvatar: entity.avatar ? entity.avatar : undefined,
        author,
        entityPath: getPathByName(PERSON, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' successfuly created',
      };
    case PEOPLE_UPDATED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        authorAvatar: author.avatar ? author.avatar : undefined,
        entityAvatar: entity.avatar ? entity.avatar : undefined,
        entityPath: getPathByName(PERSON, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' successfuly updated',
      };
    case PEOPLE_DELETED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        authorAvatar: author.avatar ? author.avatar : undefined,
        authorPath: getPathByName(PERSON, authorId),
        entityName: 'person',
        authorName: author ? author.name : '',
        content: ' successfuly deleted',
      };
    case ALERT: {
      const { label, description } = message;
      return {
        toastIntent: DANGER,
        label,
        description,
        iconName: ICON_WARNING,
      };
    }
    case EVTX_ERROR: {
      return {
        toastIntent: DANGER,
        message: message.message,
        iconName: ICON_WARNING,
      };
    }
    default:
      return null;
  }
};

export const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 200px;
`;

export const StyledFooterLine = styled.hr`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledAvatar = styled(Avatar)`cursor: pointer;`;

const StyledWrapper = styled.div`
  font-size: 1em;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: ${Colors.LIGHT_GRAY5} !important;
`;

const StyledContainer = styled.div`
  display: flex;
  max-width: 300px;
  flex-direction: column;
`;

const EntityMessage = ({
  history,
  entityName,
  content,
  entityAvatar,
  entityPath,
  authorAvatar,
  authorName,
  authorPath,
}) => (
  <StyledContainer>
    <StyledWrapper>
      <span>{`${entityName}${content}`}</span>
      <StyledFooterLine />
      <StyledFooter>
        {entityAvatar && (
          <div onClick={() => entityPath && history.push(entityPath)}>
            <StyledAvatar
              name={entityName}
              color={entityAvatar.color}
              size="MEDIUM"
            />
          </div>
        )}
        <StyledMain>
          <StyledName>
            <Icon iconName={ICON_PEOPLE} style={{ marginRight: '4px' }} />
            {authorName}
          </StyledName>
        </StyledMain>
        {authorAvatar && (
          <div onClick={() => authorPath && history.push(authorPath)}>
            <StyledAvatar
              name={authorName}
              color={authorAvatar.color}
              size="SMALL"
            />
          </div>
        )}
      </StyledFooter>
    </StyledWrapper>
  </StyledContainer>
);

EntityMessage.propTypes = {
  history: PropTypes.object,
  entityName: PropTypes.string,
  entityAvatar: PropTypes.object,
  entityPath: PropTypes.string,
  authorName: PropTypes.string,
  authorAvatar: PropTypes.object,
  authorPath: PropTypes.string,
  content: PropTypes.string,
};

const AlertErrMessage = ({ label, description }) => (
  <StyledWrapper>
    <div>{label}</div>
    <span>{description}</span>
  </StyledWrapper>
);

AlertErrMessage.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
};

const EvtxErrMessage = ({ message }) => (
  <StyledWrapper>{message}</StyledWrapper>
);

EvtxErrMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const ToastView = (type, toast, history) => {
  if (toast === null) return null;
  const {
    entityPath,
    authorPath,
    entityName,
    authorName,
    message,
    content,
    label,
    description,
    authorAvatar,
    entityAvatar,
  } = toast;
  switch (type) {
    case COMPANY_ADDED:
    case COMPANY_UPDATED:
    case COMPANY_DELETED:
    case PEOPLE_ADDED:
    case PEOPLE_UPDATED:
    case PEOPLE_DELETED:
      return (
        <EntityMessage
          history={history}
          authorAvatar={authorAvatar}
          authorName={authorName}
          authorPath={authorPath}
          content={content}
          entityAvatar={entityAvatar}
          entityName={entityName}
          entityPath={entityPath}
        />
      );
    case ALERT:
      return <AlertErrMessage label={label} description={description} />;
    case EVTX_ERROR:
      return <EvtxErrMessage message={message} />;
    default:
      return null;
  }
};

class Message extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { id } = this.props.message;
    if (id !== nextProps.message.id) {
      const { author, entity, message, history } = nextProps;
      const toastMessage = ToasterCreator(message, author, entity);
      const alert = ToastView(message.actionType, toastMessage, history);
      const { iconName, toastIntent } = toastMessage;
      const intent = Intent[toastIntent];
      Toast.show({ iconName, message: alert, intent });
    }
  }

  render() {
    return null;
  }
}

Message.propTypes = {
  message: PropTypes.object,
  author: PropTypes.object,
  entity: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { message: { authorId, entityType, entityId } } = props;
  const author = getPerson(state, authorId) || {};
  const entity =
    entityType && entityId
      ? entityType === PERSON
        ? getPerson(state, entityId)
        : getCompany(state, entityId)
      : {};
  return {
    author,
    entity,
  };
};

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Message);
