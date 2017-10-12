import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Position, Toaster, Intent } from '@blueprintjs/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { getPeople, getPerson } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getPathByName } from '../../routes';
import { ALERT, DANGER, SUCCESS } from '../../actions/message';
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

const ICON_COMPANY = 'pt-icon-home';
const ICON_PEOPLE = 'pt-icon-people';

const COMPANY = 'company';
const PERSON = 'person';

const ToasterCreator = (message, author, companies, people) => {
  const { entityId, actionType, authorId, label, description } = message;
  switch (actionType) {
    case COMPANY_ADDED: {
      const entity = companies[entityId];
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        entityPath: getPathByName(COMPANY, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' created by: ',
      };
    }
    case COMPANY_UPDATED: {
      const entity = companies[entityId];
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        entityPath: getPathByName(COMPANY, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' updated by: ',
      };
    }
    case COMPANY_DELETED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_COMPANY,
        authorPath: getPathByName(PERSON, authorId),
        entityName: 'company',
        authorName: author ? author.name : '',
        content: ' deleted by: ',
      };
    case PEOPLE_ADDED: {
      const entity = people[entityId];
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        entityPath: getPathByName(PERSON, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' created by: ',
      };
    }
    case PEOPLE_UPDATED: {
      const entity = people[entityId];
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        entityPath: getPathByName(PERSON, entityId),
        authorPath: getPathByName(PERSON, authorId),
        entityName: entity ? entity.name : '',
        authorName: author ? author.name : '',
        content: ' updated by: ',
      };
    }
    case PEOPLE_DELETED:
      return {
        toastIntent: SUCCESS,
        iconName: ICON_PEOPLE,
        authorPath: getPathByName(PERSON, authorId),
        entityName: 'person',
        authorName: author ? author.name : '',
        content: ' deleted by: ',
      };
    case ALERT:
      return {
        toastIntent: DANGER,
        label,
        description,
        iconName: 'pt-icon-cross',
      };
    default:
      return null;
  }
};

const ToastView = (type, toast, history) => {
  if (toast === null) return null;
  const {
    entityPath,
    authorPath,
    entityName,
    authorName,
    content,
    label,
    description,
  } = toast;
  switch (type) {
    case COMPANY_ADDED:
    case COMPANY_UPDATED:
    case COMPANY_DELETED:
    case PEOPLE_ADDED:
    case PEOPLE_UPDATED:
    case PEOPLE_DELETED:
      return (
        <div>
          <p>
            <a
              onClick={() =>
                entityPath
                  ? history.push(entityPath)
                  : history.push(getPathByName('notfound'))}
            >
              {entityName}
            </a>
            <span>{content}</span>
          </p>
          <p>
            <a
              onClick={() =>
                authorPath
                  ? history.push(authorPath)
                  : history.push(getPathByName('notfound'))}
            >
              {authorName}
            </a>
          </p>
        </div>
      );
    case ALERT:
      return (
        <div>
          <h4>{label}</h4>
          <span>{description}</span>
        </div>
      );
    default:
      return null;
  }
};

class Message extends React.Component {
  componentDidMount() {
    this.toast = Toaster.create({
      position: Position.TOP_RIGHT,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.message;
    if (id !== nextProps.message.id) {
      const { author, people, companies, message, history } = nextProps;
      const toastMessage = ToasterCreator(message, author, companies, people);
      const alert = ToastView(message.actionType, toastMessage, history);
      const { iconName, toastIntent } = toastMessage;
      const intent = Intent[toastIntent];
      this.toast.show({ iconName, message: alert, intent });
    }
  }

  render() {
    return null;
  }
}

Message.propTypes = {
  message: PropTypes.object,
  author: PropTypes.object,
  companies: PropTypes.object,
  people: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { message } = props;
  const author = getPerson(state, message.authorId) || {};
  return {
    author,
    people: getPeople(state),
    companies: getCompanies(state),
  };
};

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Message);
