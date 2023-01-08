# alcoholometry-core

A TypeScript implementation of International Organization of Legal Metrology ([OIML](https://www.oiml.org])) publication [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf).

## Overview

This library exports two function `density` and `massFraction`.
- `density` is computed in kg/㎥ with respect to the mass fraction ethanol in solution expressed as a number between 0 and 1 and the temperature in degrees Celcius as per the formula on page 12 of 
[r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf).
- the `massFraction`, given a density and temperature is computed using the Newton-Raphson method on the `density` function. 


## Usage
### Install
````shell
$ npm i alcoholometry-core
````
### Load
````TypeScript
const { density, massFraction } = require('alcoholometry-core');
````
or
````TypeScript
import { density, massFraction } from 'alcoholometry-core';
````
### Use
````TypeScript
let p = .73 // mass fraction of ethanol solution, should be between 0 and 1, inclusive
let t = 15.5 // temperature in °C, should be between -20°C and 40°C for formula to be valid
let d = 901.42 // density in kg/㎥, should be between  771.93 kg/㎥ and 999.97 kg/㎥ for result to be valid

console.log(density(p,t)) // prints 864.2486339111406
console.log(massFraction(d,t)) // prints 0.5709979995228677
````
### Errors
`massFraction` will throw an error if the underlying implementation of the Newton-Raphson method fails to converge within 20 iterations. Assuming that the density and temperature fall within the appropriate bounds, convergence can be essentially guarenteed (see [Valid Ranges](#valid-ranges) for details).  


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
While the `density` function is perfectly well defined for all input values, to obtain physically meaningful and valid result values should fall in the following ranges:

 - mass fraction represented as a decimal, should be, by definition, between 0 and 1 inclusive. 
 - temperature per [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf), should be between -20°C and 40°C, inclusive, to produce valid results.
 - density (for `massFraction`) should be between 771.93 kg/㎥ (density of pure ethanol at 40°C) and 999.97 kg/㎥ (density of pure water at 4°C), to produce valid results.
 
 However, staying within these ranges does not necessarily correspond to a physically meaningful state. For example water (`p=0`) experiences a phase change at `t=0`, and so `density(0,-5)` does not produce a density for any realizable state of matter at standard pressure. Similarly we can obtain anomolous results with the `massFraction` function as the following code snippet shows:
 
 ````TypeScript
 console.log(massFraction(775.42, 15.2)) 
 // prints 1.0514165233724417
 ```` 
 Moreover, convergence of `massFraction` is not gauranteed outside of the above ranges for density and temperature or even for non physically realizable combinations thereof and may throw an error:
 ````TypeScript
 massPercent(200,20);
 //Error: [alcoholometry-core] massPercent failed to converge within 20 steps. Are d and t in the appropriate ranges? See https://github.com/alpacahaircut/alcoholometry-core#README.md for details.
 ````
 ````TypeScript
 // minimum density of an ethanol solution at -19.9°C 
 // occurs with pure ethanol and is roughly equal to 823.04 kg/㎥
 massFraction(810,-19.9);
 //Error: [alcoholometry-core] massPercent failed to converge within 20 steps. Are d and t in the appropriate ranges? See https://github.com/alpacahaircut/alcoholometry-core#README.md for details.
 ````
Our tests indicate that most non-convergence occurs at or around -20°C and one can be confident in congvergence if at least one of the following conditions are met
- <var>temperature</var> is greater than or equal to -19.0°C (and all of the other above restrictions are met)
- <var>density</var> is greater than or equal to 818 kg/㎥ (and all of the other above restrictions are met)

See [tests](https://github.com/alpacahaircut/alcoholometry-core/tree/master/test) and [Testing](#testing).

### Agreement with experiment
Discrepencies between the OIML `density` function and experimental results are discussed in [r022-e75](https://www.oiml.org/en/files/pdf_r/r022-e75.pdf) for values within the above described ranges.






