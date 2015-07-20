/*jshint esnext:true */
import r from 'rethinkdb';
import Promise from 'bluebird';
import server from '../server';
import should from 'should';

let proxyPort = 8125;

describe('Connection', () => {

  before((done) => {
    server(proxyPort, done);
  });

  it('should create a connection successfully', (done) => {
    Promise.resolve()
      .then(() => {
        return [r.connect(), r.connect({ port: proxyPort })];
      })
      .spread((connA, connB) => {
        connA.port.should.equal(28015);
        connB.port.should.equal(proxyPort);
        connA.constructor.should.equal(connB.constructor);
        done();
      });
  });

});
