const nrm = require('newton-raphson-method');

//coeffeicients for OMIL function
const COEFFICIENTS = [
  [
      1.285617841998974e3,  //C_1,11 kg/(㎥ ⋅ °C)
      -3.903285426e4        //A_12   kg/㎥
  ],
  [
      7.442971530188783,    //C_2,10 kg/(㎥ ⋅ °C²)
      -7.420201433430137e3, //C_1,10 kg/(㎥ ⋅ °C)
      2.234460334e5         //A_11   kg/㎥
  ],
  [
      -5.411227621436812e-1, //C_3,9 kg/(㎥ ⋅ °C³)
      -4.414153236817392e1,  //C_2,9 kg/(㎥ ⋅ °C²)
      1.852373922069467e4,   //C_1,9 kg/(㎥ ⋅ °C)
      -5.478461354e5         //A_10  kg/㎥
  ],
  [
      2.458043105903461,     //C_3,8 kg/(㎥ ⋅ °C³)
      1.080435942856230e2,   //C_2,8 kg/(㎥ ⋅ °C²)
      -2.605562982188164e4,  //C_1,8 kg/(㎥ ⋅ °C)
      7.470172998e5          //A_9   kg/㎥
  ],
  [
      -4.672147440794683,    //C_3,7 kg/(㎥ ⋅ °C³)
      -1.422753946421155e2,  //C_2,7 kg/(㎥ ⋅ °C²)
      2.248646550400788e4,   //C_1,7 kg/(㎥ ⋅ °C)
      -6.138381234e5,        //A_8   kg/㎥
  ],
  [
      4.810060584300675,     //C_3,6 kg/(㎥ ⋅ °C³)
      1.096355666577570e2,   //C_2,6 kg/(㎥ ⋅ °C²)
      -1.210164659068747e4,  //C_1,6 kg/(㎥ ⋅ °C)
      3.062874042e5,         //A_7   kg/㎥
  ],
  [
      -2.895696483903638,    //C_3,5 kg/(㎥ ⋅ °C³)
      -5.029988758547014e1,  //C_2,5 kg/(㎥ ⋅ °C²)
      3.924090430035045e3,   //C_1,5 kg/(㎥ ⋅ °C)
      -8.829278388e4         //A_6   kg/㎥
  ],
  [
      -1.515784836987210e-6, //C_4,4 kg/(㎥ ⋅ °C⁴)
      1.022992966719220,     //C_3,4 kg/(㎥ ⋅ °C³)
      1.353034988843029e1,   //C_2,4 kg/(㎥ ⋅ °C²)
      -7.047478054272792e2,  //C_1,4 kg/(㎥ ⋅ °C)
      1.352215441e4          //A_5   kg/㎥
  ],
  [
      6.515031360099368e-6,  //C_4,3 kg/(㎥ ⋅ °C⁴)
      -2.002561813734156e-1, //C_3,3 kg/(㎥ ⋅ °C³)
      -2.170575700536993,    //C_2,3 kg/(㎥ ⋅ °C²)
      7.196353469546523e1,   //C_1,3 kg/(㎥ ⋅ °C)
      -1.668103923e3         //A_4   kg/㎥
  ],
  [
      1.345612883493354e-8,  //C_5,2 kg/(㎥ ⋅ °C⁵)
      -8.763058573471110e-6, //C_4,2 kg/(㎥ ⋅ °C⁴)
      1.876837790289664e-2,  //C_3,2 kg/(㎥ ⋅ °C³)
      2.517399633803461e-1,  //C_2,2 kg/(㎥ ⋅ °C²)
      -1.046914743455169e1,  //C_1,2 kg/(㎥ ⋅ °C)
      3.891238958e2          //A_3   kg/㎥
  ],
  [
      -2.788074354782409e-8, //C_5,1 kg/(㎥ ⋅ °C⁵)
      4.075376675622027e-6,  //C_4,1 kg/(㎥ ⋅ °C⁴)
      -6.802995733503803e-4, //C_3,1 kg/(㎥ ⋅ °C³)
      -1.193013005057010e-2, //C_2,1 kg/(㎥ ⋅ °C²)
      1.693433461530087e-1,  //C_1,1 kg/(㎥ ⋅ °C)
      -1.929769495e2         //A_2   kg/㎥
  ],
  [
      -9.9739231e-11,        //B_6   kg/(㎥ ⋅ °C⁶)
      7.1693540e-9,          //B_5   kg/(㎥ ⋅ °C⁵)
      -3.8957702e-7,         //B_4   kg/(㎥ ⋅ °C⁴)
      3.6130013e-5,          //B_3   kg/(㎥ ⋅ °C³)
      -5.2682542e-3,         //B_2   kg/(㎥ ⋅ °C²)
      -2.0618513e-1,         //B_1   kg/(㎥ ⋅ °C)
      9.982012300e2          //A_1   kg/㎥
  ]
]

//coefficiencts for the derivative of oiml function
const D_COEFFICIENTS = COEFFICIENTS.slice(0,11)
  .map((row, i) => row.map(v => v*(11-i)))



/*
* Utility function for evaluting a polynomial, p, at v
* 
* @param coeffs - array of coefficients in reverse order, i.e for polynomial p(x) = a_0+a_1x+...+x_nx^n, we pass [a_n, a_{n-1},...,a_0]
*
* @param v - the value at which to evaluate the polynomial
*
* @returns the value of polynomial, p, at v, i.e. p(v)
*/
function poly_eval(coeffs:number[], v:number):number{
  return coeffs.reduce((acc,val) => acc*v+val, 0)
}

/*
* Computes the density of an aquaeous ethanol solution
* based on th mass/mass ratio of ethanol in solution
* and the temperature, based on the formula givin in
* https://www.oiml.org/en/files/pdf_r/r022-e75.pdf
* 
* @param p - the mass/mass ratio of ethanol in solution 
*                     (should be between 0 and 1, inclusive, to be valid)
* @param t - the temperature of the solution in °C 
*               (should be bewteen -20 and 40, inclusive, to be valid)    
*
* @returns the density of the solution in kg/㎥      
*/
export function density(p:number, t: number):number{
  return poly_eval(
    COEFFICIENTS.map(
      (row) => poly_eval(row, t-20)
    ),
  p)
}

/*
* Computes the partial derivitive of the `density` function
* with respect to the mass/mass ratio of the solution
*
* @note this is a utility function to use with Newton-Raphson method to compute inverse to the main oiml function
* 
* @param p - the mass/mass ratio of ethanol in solution (should be between 0 and 1, inclusive, to be valid)
* @param temp - the temperature of the solution in °C (should be bewteen -20 and 40, inclusive, to be valid)    
*
* @returns the infinitessimal change in density of the solution in kg/㎥      
*/

function d_density(p: number, t: number):number{
  return poly_eval(
    D_COEFFICIENTS.map(
      (row) => poly_eval(row,t-20)
    ),
    p
  )
}


/*
* Uses Newton-Raphson method to compute the mass/mass ratio
* of an aqueous solution of ethanol given a density and temperature
* 
* @param d - the density of ethanol solution in kg/㎥ (should be between 771.93 and 999.97, inclusive, to be valid)
* @param t - the temperature of the solution in °C (should be bewteen -20 and 40, inclusive, to be valid)    
*
* @returns the infinetesimal change in density of the solution in kg/㎥      
*/
export function mass_percent(d:number, t:number):number{
  return nrm(
      (m:number) => density(m, t) - d,
      (m:number) => d_density(m, t),
      .5,
  )
}
