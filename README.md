# esamegen
Javascript test data generator



## Usage

  var esamegen = require('esamegen')
      counter = esamegen.counter,
      ipAddressCounter = esamegen.ipAddressCounter;

  // will return value from 'default' counter
  console.log(counter()); // => 0
  // second call will return same value
  console.log(counter()); // => 0
  
  // increment counter by 5
  console.log(counter({incrementBy: 5})); // => 5
  
  // create new counter with name counter1 and minimun value 100
  console.log(counter({name: 'counter1', min: 100})); // => 100
  
  // value of counter 'default' is still unchanged 
  console.log(counter()); // => 5

  // will return value from 'default' IP address counter (this is separate from the normal counter)
  console.log(ipAddressCounter()); // => 0.0.0.0
  // second call will return same value
  console.log(ipAddressCounter()); // => 0.0.0.0
  
  // increment counter by 5
  console.log(ipAddressCounter({incrementBy: 5})); // => 0.0.0.5
  
  // create new counter with name counter1 and minimun value 0.0.0.100
  console.log(counter({name: 'counter1', min: 0.0.0.100})); // => 0.0.0.100
  
  // value of counter 'default' is still unchanged 
  console.log(counter()); // => 0.0.0.5


## Tests

  npm test


## Release History

* 0.0.1 Initial release
