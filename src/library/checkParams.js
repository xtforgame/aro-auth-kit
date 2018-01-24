import { RestfulError } from 'az-restful-helpers';

export function defaultOnFailToCheckReqParams(value) {
  return new RestfulError(400, `"${value}" is empty`);
}

export default function checkParams(obj, _requiredParams, onFail = defaultOnFailToCheckReqParams) {
  const requiredParams = _requiredParams || [];
  for (let i = 0; i < requiredParams.length; i++) {
    // if(!(requiredParams[i] in obj)){
    if (obj[requiredParams[i]] == null) {
      return onFail(requiredParams[i], i, requiredParams);
    }
  }
  return null;
}
