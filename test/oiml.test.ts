import { density, mass_percent } from '../src';

describe('oiml', () => {
  it('Matches tabulated values at p=.31, t=13°C.', () => {
    expect(density(.31,13).toFixed(2)).toEqual("956.42");
  });
  it('Matches tabulated values at p=.88, t=-10°C.', () => {
    expect(density(.88,-10).toFixed(2)).toEqual("848.57")
  });
});

describe('oiml_inverse', () => {
  it('Matches tabulated values at density = 848.4 kg/㎥ and t=20°C.', () => {
    expect(mass_percent(848.4,20).toFixed(4)).toEqual("0.7796")
  });
  it('Acts as left inverse to oiml.', () => {
    expect(mass_percent(mass_percent(.1345, 28.22),28.22).toFixed(12)).toEqual("0.134500000000")
  });
  it('Acts as right inverse to oiml.', () => {
    expect(density(mass_percent(734.453, -10),-10).toFixed(9)).toEqual("734.453000000")
  });
});
