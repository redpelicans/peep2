import React from 'react';
import PropTypes from 'prop-types';
import { Position, Toaster, Intent } from '@blueprintjs/core';
import { DANGER, PRIMARY, SUCCESS, WARNING } from '../../actions/message';

class Message extends React.Component {
  componentDidMount() {
    this.toast = Toaster.create({
      position: Position.TOP_RIGHT,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.message;
    if (id !== nextProps.message.id) {
      const { message: { type, message, description } } = nextProps;
      const alert = <div><h3>{message}</h3><p>{description}</p></div>;
      const iconName = this.getIcon(type);
      const intent = Intent[type];
      this.toast.show({ iconName, message: alert, intent });
    }
  }

  getIcon = type => {
    switch (type) {
      case DANGER: return 'pt-icon-error';
      case PRIMARY: return 'pt-icon-help';
      case SUCCESS: return 'pt-icon-tick';
      case WARNING: return 'pt-icon-warning-sign';
      default: return null;
    }
  }

  render() {
    return null;
  }
}

Message.propTypes = {
  message: PropTypes.object,
};

export default Message;
