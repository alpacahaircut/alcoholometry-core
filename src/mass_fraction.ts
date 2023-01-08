import { density as _density, dDensity } from './density';

/**
 * Uses Newton-Raphson method to compute the mass/mass ratio
 * of an aqueous solution of ethanol given a density and temperature
 *
 * @param density - the density of ethanol solution in kg/㎥ (should be between 771.93 and 999.97, inclusive, to be valid)
 * @param temperature - the temperature of the solution in °C (should be bewteen -20 and 40, inclusive, to be valid)
 *
 * @returns the infinetesimal change in density of the solution in kg/㎥
 *
 * @throws Error if Newton-Raphson fails to converge in 20 steps
 */
export function massFraction(density: number, temperature: number): number {
  //Max number of iterations of Newton-Raphson before we error out
  const maxIters = 20;
  //Threshold for testing convergence: |x1-x0|<threshold => convergence
  const threshold = 1e-9;

  //Initial Guess
  let x0 = 0.5;
  let x1 = 0;
  for (let i = 0; i < maxIters; i++) {
    //nrm main step
    x1 = x0 - (_density(x0, temperature) - density) / dDensity(x0, temperature);

    //check for convergence
    if (Math.abs(x1 - x0) < threshold) {
      return x1;
    }
    //Update Guess
    x0 = x1;
  }

  throw new Error(
    '[alcoholometry-core] massPercent failed to converge within 20 steps. Are d and t in the appropriate ranges? See https://github.com/alpacahaircut/alcoholometry-core#README.md for details.'
  );
}
