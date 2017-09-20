import socketIOClient from "socket.io-client";
import initHttp from "../http";
import initSocketIO from "../socketio";
import initEvtx from "../evtx";
import initMongo from "../mongo";
import config from "../../../params";

let peep;

beforeAll(() =>
  initMongo({ config })
    .then(initHttp)
    .then(initSocketIO)
    .then(initEvtx)
    .then(ctx => (peep = ctx))
);

describe("Main", () => {
  it("expect ping", done => {
    const data = "coucou";
    const message = {
      type: "status:ping",
      payload: { data },
      replyTo: "pong"
    };
    const io = socketIOClient.connect(peep.http.url);
    io.on("action", message => {
      expect(message.type).toEqual("pong"),
        expect(message.payload.data).toEqual(data),
        done();
    });
    io.emit("action", message);
  });

  it("expect not ping", done => {
    const data = "coucou";
    const message = {
      type: "status:notping",
      payload: { data },
      replyTo: "pong"
    };
    const io = socketIOClient.connect(peep.http.url);
    io.on("action", message => {
      expect(message.type).toEqual("EvtX:Error"),
        expect(message.error).not.toBeNull(),
        done();
    });
    io.emit("action", message);
  });

  it("expect ping with callback", done => {
    const data = "coucou";
    const message = {
      type: "status:ping",
      payload: { data }
    };
    const io = socketIOClient.connect(peep.http.url);
    io.emit("action", message, (err, res) => {
      expect(res.data).toEqual(data), done();
    });
  });

  it("expect not ping with callback", done => {
    const data = "coucou";
    const message = {
      type: "status:notping",
      payload: { data }
    };
    const io = socketIOClient.connect(peep.http.url);
    io.emit("action", message, (err, res) => {
      expect(err).not.toBeNull(), done();
    });
  });
});
