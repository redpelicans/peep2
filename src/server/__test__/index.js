import should from 'should';
import socketIOClient from 'socket.io-client';
import initHttp from '../http';
import initSocketIO from '../socketio';
import initEvtx from '../evtx'
import initMongo from '../mongo';
import config from '../../../config';

describe('Main', function() {
  before(function() {
    return initMongo({ config })
      .then(initHttp)
      .then(initSocketIO)
      .then(initEvtx)
      .then((peep) => this.peep = peep);
    }
  );

  it('should ping', function(done) {
    const data = 'coucou';
    const message = {
      type: 'status:ping',
      payload: { data },
      replyTo: 'pong',
    };
    const io = socketIOClient.connect(this.peep.http.url);
    io.on('action', (message) => {
      should(message.type).eql('pong'),
      should(message.payload.data).eql(data),
      done();
    });
    io.emit('action', message);
  });

  it('should not ping', function(done) {
    const data = 'coucou';
    const message = {
      type: 'status:Ping',
      payload: { data },
      replyTo: 'pong',
    };
    const io = socketIOClient.connect(this.peep.http.url);
    io.on('action', (message) => {
      should(message.type).eql('EvtX:Error'),
      should(message.error).not.null(),
      done();
    });
    io.emit('action', message);
  });


  it('should ping with callback', function(done) {
    const data = 'coucou';
    const message = {
      type: 'status:ping',
      payload: { data },
    };
    const io = socketIOClient.connect(this.peep.http.url);
    io.emit('action', message, (err, res) => {
      should(res.data).eql(data),
      done();
    });
  });

  it('should not ping with callback', function(done) {
    const data = 'coucou';
    const message = {
      type: 'status:Ping',
      payload: { data },
    };
    const io = socketIOClient.connect(this.peep.http.url);
    io.emit('action', message, (err, res) => {
      should(err).not.null(),
      done();
    });
  });

});
