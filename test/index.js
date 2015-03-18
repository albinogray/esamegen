var should = require('chai').should();
var expect = require('chai').expect;

var esamagen = require('../index');
var counter = esamagen.counter;
var clearCounter = esamagen.clearCounter;

var counterIpAddress = esamagen.ipAddressCounter;
var clearIpAddressCounter = esamagen.clearIpAddressCounter;


beforeEach(function(done){
  clearCounter();
  clearIpAddressCounter();
  done();
});

describe('#counter', function() {

  it('clear all counter', function() {
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(1);
    clearCounter();
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(1);
  });

  it('clear one counter', function() {
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(1);
    clearCounter('counter1');
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(2);
  });

  it('clear both named counters', function() {
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(1);
    clearCounter(['counter1', 'counter2']);
    counter({name: 'counter1', incrementBy: 1}).should.equal(1);
    counter({name: 'counter2', incrementBy: 1}).should.equal(1);
  });

  it('counter with no min value', function() {
    counter().should.equal(0);
  });

  it('counter with min value 5', function() {
    counter({init: true, min: 5}).should.equal(5);
  });

  it('counter with max value less than min value', function() {
    var fn = function() {
      counter({init: true, min: 5, max: 4});
    }
    expect(fn).to.throw(Error);
  });


  it('counter with name testCounter = 0 two consecutive calls;', function() {
    counter({name: 'testCounter'}).should.equal(0);
    counter({name: 'testCounter'}).should.equal(0);
  });

  it('counter with name testCounter should increment for second call', function() {
    counter({name: 'testCounter'}).should.equal(0);
    counter({name: 'testCounter', incrementBy: 1}).should.equal(1);
  });

  it('counter wraps after max', function() {
    counter({name: 'testCounter', max: 1}).should.equal(0);
    counter({name: 'testCounter', incrementBy: 1}).should.equal(1);
    counter({name: 'testCounter', incrementBy: 1}).should.equal(0);
  });
});


describe('#IP address counter - ', function() {

  it('clear all IP address counter', function() {
    counterIpAddress({name: 'counter1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counter2', incrementBy: 1}).should.equal('0.0.0.1');
    clearIpAddressCounter();
    counterIpAddress({name: 'counter1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counter2', incrementBy: 1}).should.equal('0.0.0.1');
  });

  it('clear one IP address counter', function() {
    counterIpAddress({name: 'counter1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counter2', incrementBy: 1}).should.equal('0.0.0.1');
    clearIpAddressCounter('counter1');
    counterIpAddress({name: 'counter1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counter2', incrementBy: 1}).should.equal('0.0.0.2');
  });

  it('clear both named IP address counters', function() {
    counterIpAddress({name: 'counterIpAddress1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counterIpAddress2', incrementBy: 1}).should.equal('0.0.0.1');
    clearIpAddressCounter(['counterIpAddress1', 'counterIpAddress2']);
    counterIpAddress({name: 'counterIpAddress1', incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({name: 'counterIpAddress2', incrementBy: 1}).should.equal('0.0.0.1');
  });

  it('IP address counter with default min value', function() {
    counterIpAddress().should.equal('0.0.0.0');
  });

  it('IP address counter with min value 5', function() {
    counterIpAddress({init: true, min: '0.0.0.5'}).should.equal('0.0.0.5');
  });


  it('IP address counter min value should be IP address', function() {
    var fn = function() {
      counterIpAddress({init: true, min: '0.0.0'});
    };
    expect(fn).to.throw();
  });

  it('IP address counter max value should be IP address', function() {
    var fn = function() {
      counterIpAddress({init: true, max: '0.0.0'})
    };
    expect(fn).to.throw(Error);

  });

  it('IP address counter with max value less than min value', function() {
    var fn = function() {
      counterIpAddress({init: true, min: '0.0.0.5', max: '0.0.0.4'});
    }
    expect(fn).to.throw(Error);
  });


  it('IP address counter two consecutive calls;', function() {
    counterIpAddress().should.equal('0.0.0.0');
    counterIpAddress().should.equal('0.0.0.0');
  });

  it('IP address counter should increment for second call', function() {
    counterIpAddress().should.equal('0.0.0.0');
    counterIpAddress({incrementBy: 1}).should.equal('0.0.0.1');
  });

  it('IP address counter should increment from 0.0.0.255 to 0.0.1.0', function() {
    counterIpAddress({incrementBy: 255}).should.equal('0.0.0.255');
    counterIpAddress({incrementBy: 1}).should.equal('0.0.1.0');
  });

  it('IP address counter should increment from 0.0.255.0 to 0.1.0.0', function() {
    counterIpAddress({min:'0.0.255.0'}).should.equal('0.0.255.0');
    counterIpAddress({incrementBy: (255 + 1)}).should.equal('0.1.0.0');
  });

  it('IP address counter should increment from 0.255.0.0 to 1.0.0.0', function() {
    counterIpAddress({min:'0.255.0.0'}).should.equal('0.255.0.0');
    var incValue = 255 * 255 + 255 + 255 + 1;
    counterIpAddress({incrementBy: incValue}).should.equal('1.0.0.0');
  });

  it('IP address counter wraps after max', function() {
    counterIpAddress({max: '0.0.0.1'}).should.equal('0.0.0.0');
    counterIpAddress({incrementBy: 1}).should.equal('0.0.0.1');
    counterIpAddress({incrementBy: 1}).should.equal('0.0.0.0');
  });
});
