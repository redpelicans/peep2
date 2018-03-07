import debug from 'debug';
import R from 'ramda';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Person from '../models/people';
import { isRejected, isValidated } from '../../client/utils/events';
import { getField } from '../../client/forms/events';
import { getLabelFromValueDomain } from '../../client/forms/utils';
import { getPathByName } from '../../client/routes';
import { MarkdownConvertor } from '../../client/components/widgets/Markdown';

const ADD = 'add';
const UPDATE = 'update';
const DELETE = 'delete';

const loginfo = debug('peep:emails');

const dateFormat = 'dddd Do MMMM';
const getVerbFromAction = action =>
  ({ [ADD]: 'added', [UPDATE]: 'updated', [DELETE]: 'deleted' }[action]);
const MailToManager = ({ eventGroup, worker, action, url }) => {
  const agendaPath = `${url}${getPathByName('agenda')}`;
  const personPath = `${url}${getPathByName('person', worker._id)}`;
  const statusField = getField('status');
  const typeField = getField('type');
  const deletedTitle = (
    <span>
      <a href={personPath}>{worker.fullName()}</a> {getVerbFromAction(action)}{' '}
      event below:
    </span>
  );
  const nonDeletedTitle = (
    <span>
      <a href={personPath}>{worker.fullName()}</a> {getVerbFromAction(action)}{' '}
      <a href={agendaPath}>event</a> below:
    </span>
  );
  return (
    <div>
      {action !== DELETE ? nonDeletedTitle : deletedTitle}
      <p />
      <ul>
        <li>From: {format(eventGroup.from, dateFormat)}</li>
        <li>To: {format(eventGroup.to, dateFormat)}</li>
        <li>Type: {getLabelFromValueDomain(typeField, eventGroup.type)}</li>
        <li>
          Status: {getLabelFromValueDomain(statusField, eventGroup.status)}
        </li>
        {eventGroup.description && (
          <li>
            Description:{' '}
            <MarkdownConvertor>{eventGroup.description}</MarkdownConvertor>
          </li>
        )}
      </ul>
    </div>
  );
};

MailToManager.propTypes = {
  eventGroup: PropTypes.object,
  worker: PropTypes.object,
  action: PropTypes.func,
  url: PropTypes.string,
};

const sendEmailToManagers = (
  send,
  action,
  url,
  eventGroup,
  worker,
  managers,
) => {
  const Root = (
    <MailToManager
      eventGroup={eventGroup}
      worker={worker}
      action={action}
      url={url}
    />
  );
  const [to, ...cc] = R.map(manager => manager.email, managers);
  const mailOptions = {
    from: 'Peep peep dont sleep<peep@redpelicans.com>',
    subject: 'peep calendar',
    html: renderToString(Root),
    to,
  };
  return send(cc.length ? { ...mailOptions, cc } : mailOptions);
};

const getAcceptanceFromAction = (action, event) => {
  if (action === DELETE) return 'deleted';
  if (action === ADD) return 'added';
  if (action === UPDATE) {
    if (isValidated(event)) return 'validated';
    else if (isRejected(event)) return 'rejected';
    else return 'updated';
  }
};

const MailToWorker = ({ eventGroup, author, action, url }) => {
  const agendaPath = `${url}${getPathByName('agenda')}`;
  const personPath = `${url}${getPathByName('person', author._id)}`;
  const statusField = getField('status');
  const typeField = getField('type');
  const deletedTitle = (
    <span>
      <a href={personPath}>{author.fullName()}</a>{' '}
      {getAcceptanceFromAction(action, eventGroup)} event below:
    </span>
  );
  const nonDeletedTitle = (
    <span>
      <a href={personPath}>{author.fullName()}</a>{' '}
      {getAcceptanceFromAction(action, eventGroup)}{' '}
      <a href={agendaPath}>event</a> below:
    </span>
  );
  return (
    <div>
      {action !== DELETE ? nonDeletedTitle : deletedTitle}
      <p />
      <ul>
        <li>From: {format(eventGroup.from, dateFormat)}</li>
        <li>To: {format(eventGroup.to, dateFormat)}</li>
        <li>Type: {getLabelFromValueDomain(typeField, eventGroup.type)}</li>
        <li>
          Status: {getLabelFromValueDomain(statusField, eventGroup.status)}
        </li>
        {eventGroup.description && (
          <li>
            Description:{' '}
            <MarkdownConvertor>{eventGroup.description}</MarkdownConvertor>
          </li>
        )}
      </ul>
    </div>
  );
};

MailToWorker.propTypes = {
  eventGroup: PropTypes.object,
  author: PropTypes.object,
  action: PropTypes.func,
  url: PropTypes.string,
};

const sendEmailToWorker = (send, action, url, eventGroup, author, worker) => {
  const Root = (
    <MailToWorker
      eventGroup={eventGroup}
      author={author}
      action={action}
      url={url}
    />
  );
  const mailOptions = {
    from: 'Peep peep dont sleep<peep@redpelicans.com>',
    subject: 'peep calendar',
    html: renderToString(Root),
  };
  return send({ ...mailOptions, to: worker.email });
};

const isManager = (managers, person) =>
  R.find(manager => person.equals(manager), managers);

const sendEmail = (send, action, url) => ({ output: eventGroup, author }) => {
  if (!eventGroup) return;
  const { workerId } = eventGroup;
  Person.loadOne(workerId)
    .then(worker =>
      Person.getManagers(worker).then(managers => {
        if (!isManager(managers, author))
          return sendEmailToManagers(
            send,
            action,
            url,
            eventGroup,
            worker,
            managers,
          );
        if (!worker.equals(author) && isManager(managers, author))
          return sendEmailToWorker(
            send,
            action,
            url,
            eventGroup,
            author,
            worker,
          );
      }),
    )
    .catch(console.error); // eslint-disable-line no-console
};

const init = ctx => {
  const { evtx, config: { siteUrl }, email: { sendMail } } = ctx;
  evtx
    .service('events')
    .on('eventGroup:added', sendEmail(sendMail, ADD, siteUrl));
  evtx
    .service('events')
    .on('eventGroup:updated', sendEmail(sendMail, UPDATE, siteUrl));
  evtx
    .service('events')
    .on('eventGroup:deleted', sendEmail(sendMail, DELETE, siteUrl));
  loginfo('events emails service registered');
  return Promise.resolve(ctx);
};

export default init;
