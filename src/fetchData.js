const LON = 153.026;
const LAT = -27.4705;
const PROJYEARS = `2016-2045,2036-2065,2056-2085,2075-2104`;
const thisYear = new Date().getFullYear();
const VARIABLE = 'tmin'

const _fetch = (URL, auth) => {
  if(localStorage.getItem(URL)) {
    return JSON.parse(localStorage.getItem(URL));
  }
  return fetch(URL, {
    method: "get",
    headers: new Headers({
      Authorization: `Basic ${btoa(auth)}`,
    }),
  })
    .then((res) => res.json())
    .then((resJ) => { 
      localStorage.setItem(URL, JSON.stringify(resJ));
      return resJ } );
}

const getObs = (auth) => {
  const URL = `https://demo.indraweb.io/csa-data/observations/getObservations?lon=${LON}&lat=${LAT}&variable=${VARIABLE}&frequency=monthly&startYear=1961&endYear=${
    thisYear - 1
  }`;
  return _fetch(URL, auth);
};

const getProj = (auth) => {
  const URL = `https://demo.indraweb.io/csa-data/projections/getProjections?lon=${LON}&lat=${LAT}&variable=${VARIABLE}&frequency=monthly&years=${PROJYEARS}&emission=rcp45,rcp85`;
  return _fetch(URL, auth);
};

export const fetchData = async (auth) => {
  const oresp = await getObs(auth);
  const presp = await getProj(auth);

  // Extract Observations
  const combinedDict = oresp.data.reduce((prev, curr) => {
    prev[curr.year] = {
      obs: curr.values,
    };
    return prev;
  }, {});

  // Extract Projections
  const access1proj = presp.data.filter((d) => d.model === "ACCESS1-0");
  access1proj.forEach((d) => {
    d.yearValues.forEach((yv) => {
      combinedDict[yv.year] = {
        ...(combinedDict[yv.year] || {}),
        [d.rcp]: yv.values,
      };
    });
  });

  return combinedDict;
};
