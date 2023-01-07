# alcoholometry-core

A TypeScript implementation of International Organization of Legal Metrology ([OIML](https://www.oiml.org])) publication [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf).

## Overview

This library exports two function `density` and `massPercent`.
- `density` is computed in kg/㎥ with respect to the mass percent ethanol in solution, <var>p</var>, expressed as a number between 0 and 1 and the temperature, <var>t</var>, in degrees Celcius as per the formula on page 12 of 
[r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf).
- the `massPercent`, given a density, <var>d</var>, and temperature, <var>t</var>, is computed using the Newton-Raphson method on the `density` function. 


## Usage
### Install
````shell
$ npm i alcoholometry-core
````
### Load
````TypeScript
const { density, massPercent } = require('alcoholometry-core');
````
or
````TypeScript
import { density, massPercent } from 'alcoholometry-core';
````
### Use
````TypeScript
let p = .73 // % by mass of solution, should be between 0 and 1, inclusive
let t = 15.5 // temperature in °C, should be between -20°C and 40°C for formula to be valid
let d = 901.42 // density in kg/㎥, should be between  771.93 kg/㎥ and 999.97 kg/㎥ for result to be valid

console.log(density(p,t)) // prints 864.2486339111406
console.log(massPercent(d,t)) // prints 0.5709979995228677
````
### Errors
`mass_percent` will throw an error if the underlying implementation of the Newton-Raphson method fails to converge within 20 iterations. Assuming that the density, <var>d</var>, and temperature, <var>t</var>, fall within the appropriate bounds (see [Valid Ranges](###valid-ranges)) convergence can be essentially guarenteed (see [tests](https://github.com/alpacahaircut/alcoholometry-core/tree/master/test) and [Testing](#testing)).


## Building
````shell
$ git clone https://github.com/alpacahaircut/alcoholometry-core
$ cd alcoholometry-core
$ npm run build
````
## Testing
```bash
$ npm test
```


## Physical Considerations
### Pressure
`density` does not account for ambient pressure. Functions only model physical solutions at standard pressure. 

### Valid Ranges
While the `density` function is perfectly well defined for all values of <var>p</var> and <var>t</var>, to obtain physically meaningful and valid result values should fall in the following ranges:

 - mass percent, <var>p</var>, represented as a decimal, should be, by definition, between 0 and 1 inclusive. 
 - temperature, <var>t</var>, per [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf), should be between -20°C and 40°C, inclusive, to produce valid results.
 - density, <var>d</var>, should be between 771.93 kg/㎥ (density of pure ethanol at 40°C) and 999.97 kg/㎥ (density of pure water at 4°C), to produce valid results.
 
 However, staying within these ranges does not necessarily correspond to a physically meaningful state. For example water (`p=0`) experiences a phase change at `t=0`, and so `density(0,-5)` does not produce a density for any realizable state of matter at standard pressure. Similarly we can obtain anomolous results with the `massPercent` function as the following code snippet shows:
 
 ````TypeScript
 console.log(massPercent(775.42, 15.2)) 
 // prints 1.0514165233724417
 ```` 
 Moreover, convergence of `massPercent` is not gauranteed outside of the above ranges for <var>d</var> and <var>t</var> and may throw an error:
 ````TypeScript
 massPercent(200,20)
 //Error: [alcoholometry-core] massPercent failed to converge within 20 steps. Are d and t in the appropriate ranges? See https://github.com/alpacahaircut/alcoholometry-core#README.md for details.
 ````

### Agreement with experiment
Discrepencies between the OIML `density` function and experimental results are discussed in [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf) for values within the above described ranges.






