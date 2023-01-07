import { density, massPercent } from '../src';


describe('density', () => {
  it('Matches tabulated values at p=.31, t=13°C.', () => {
    expect(density(.31,13).toFixed(2)).toEqual("956.42");
  });
  it('Matches tabulated values at p=.88, t=-10°C.', () => {
    expect(density(.88,-10).toFixed(2)).toEqual("848.57")
  });
});

describe('mass_percent', () => {
  it('Matches tabulated values at density = 848.4 kg/㎥ and t=20°C.', () => {
    expect(massPercent(848.4,20).toFixed(4)).toEqual("0.7796")
  });
  it('Acts as left inverse to oiml.', () => {
    expect(massPercent(density(.1345, 28.22),28.22).toFixed(12)).toEqual("0.134500000000")
  });
  it('Acts as right inverse to oiml.', () => {
    expect(density(massPercent(734.453, -10),-10).toFixed(9)).toEqual("734.453000000")
  });
  it('Converges for all values 771.93 <= d <= 999.97 and -19.0 <= t <= 40', () => {
    const D_MIN = 771.93;
    const D_MAX = 999.97;
    const D_MESH_SIZE = 100;
    const D_STEP = (D_MAX - D_MIN)/D_MESH_SIZE;
    const T_MIN = -19;
    const T_MAX = 40;
    const T_STEP = .1;
    let ok = true;

    for(let t = T_MIN; t <= T_MAX; t+=T_STEP){
      for(let d = D_MIN; d<= D_MAX; d+=D_STEP){
        try{
          massPercent(d,t);
        }
        catch(e){
          ok = false;
          break;
        }
      }
      if(!ok){
        break;
      }
    }
    expect(ok).toStrictEqual(true)
  });
  it('Converges for all values 818 <= d <= 999.97 and -20.0 <= t <= -19', () => {
    const D_MIN = 818;
    const D_MAX = 999.97;
    const D_MESH_SIZE = 100;
    const D_STEP = (D_MAX - D_MIN)/D_MESH_SIZE;
    const T_MIN = -20;
    const T_MAX = -19;
    const T_STEP = .05;
    let ok = true;

    for(let t = T_MIN; t <= T_MAX; t+=T_STEP){
      for(let d = D_MIN; d<= D_MAX; d+=D_STEP){
        try{
          massPercent(d,t);
        }
        catch(e){
          ok = false;
          break;
        }
      }
      if(!ok){
        break;
      }
    }
    expect(ok).toStrictEqual(true)
  });
});
