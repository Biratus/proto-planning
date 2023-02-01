// Front
export const toGetParams = (params:any) =>
  "?" + new URLSearchParams(params).toString();

export const searchParamsClone = (params:any) => {
  let newParams = new URLSearchParams();
  for (let key of params.keys()) {
    newParams.set(key, params.get(key));
  }
  return newParams;
};

type URLChangeParam = {
    params:any,
    path:string,
    newParams:any
}

export const changeURLParam = ({ params: originalParams, path, newParams }:URLChangeParam) => {
  let params = searchParamsClone(originalParams);

  for (let k in newParams) {
    if (newParams[k] === undefined) params.delete(k);
    else params.set(k, newParams[k]);
  }

  return `${path}?${params.toString()}`;
};
