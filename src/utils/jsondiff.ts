export type TObject = {
  [key: string]: any;
}

export type TDiff = {
  changed: boolean;
  position: string;
  type: string;
  incompatible?: boolean;
  add?: boolean;
  remove?: boolean;
  change?: boolean;
}


const arrayDiff = (left: any[], right: any[], key = '$') => {
  const result: TDiff[] = [];
  let lp = 0;
  let rp = 0;
  const indexRemoval = (ix: number) => ({ changed: true, remove: true, type: `index - ${ix} is removed from right`, position: `${key}[${ix}]` });
  const indexAddition = (ix: number) => ({ changed: true, add: true, type: `index - ${ix} is added to right`, position: `${key}[${ix}]` });
  while (lp < left.length && rp < right.length) {
    const diff = checkJSONDiff(left[lp], right[rp], `${key}[${lp}]`);
    result.push(...diff)
    lp += 1;
    rp += 1;
  }
  while (lp < left.length) {
    result.push(indexRemoval(lp))
    lp += 1;
  }
  while (rp < right.length) {
    result.push(indexAddition(rp))
    rp += 1;
  }
  return result;
}

const objectDiff = (left: TObject, right: TObject, key = '$') => {
  const result: TDiff[] = [];
  const lKeys = Object.keys(left).sort();
  const rKeys = Object.keys(right).sort();
  const keyRemoval = (oKey: string) => ({ changed: true, remove: true, type: `key - ${oKey} is removed from right`, position: `${key}.${oKey}` });
  const keyAddition = (oKey: string) => ({ changed: true, add: true, type: `key - ${oKey} is added to right`, position: `${key}.${oKey}` });
  let [lp, rp] = [0, 0];
  while (lp < lKeys.length && rp < rKeys.length) {
    const lKey = lKeys[lp];
    const rKey = rKeys[rp];
    // console.log(`checking ${lKey} & ${rKey} at ${key}`);
    if (lKey === rKey) {
      const diff = checkJSONDiff(left[lKey], right[rKey], `${key}.${lKey}`);
      result.push(...diff);
      lp += 1;
      rp += 1;
    } else if (lKey < rKey) {
      result.push(keyRemoval(lKey));
      lp += 1;
    } else {
      result.push(keyAddition(rKey));
      rp += 1;
    }
  }
  while (lp < lKeys.length) {
    // console.log(`checking ${lKeys[lp]} at ${key}`);
    result.push(keyRemoval(lKeys[lp]))
    lp += 1;
  }
  while (rp < rKeys.length) {
    // console.log(`checking ${rKeys[rp]} at ${key}`);
    result.push(keyAddition(rKeys[rp]))
    rp += 1;
  }
  return result;
}

export const checkJSONDiff = (left: any, right: any, key = '$'): TDiff[] => {
  const equality = (): TDiff => ({ changed: false, change: false, type: 'values are same', position: `${key}` });
  const inequality = (): TDiff => ({ changed: true, change: true, type: 'values are not same', position: `${key}` });
  const incompatibility = (): TDiff => ({ changed: true, incompatible: true, type: 'incompatible types', position: `${key}` });

  if (typeof left !== typeof right) {
    return [incompatibility()];
  }
  if (typeof left === 'object' && left) {
    if (Array.isArray(left) && !Array.isArray(right)) {
      return [incompatibility()];
    }
    if (!Array.isArray(left) && Array.isArray(right)) {
      return [incompatibility()];
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      return arrayDiff(left, right, key);
    }
    return objectDiff(left, right, key);
  }
  if (left === right) {
    return [equality()];
  } else {
    return [inequality()];
  }
  // if (typeof left === 'object' && typeof right === 'object' && left && right) {
  // }

}

export const sortJSONArray = (a: TObject[]): TObject[] => {
  const result = [];
  for (let val of a) {
    if (val && typeof val === 'object') {
      if(Array.isArray(val)) {
        result.push(sortJSONArray(val));
      } else {
        result.push(sortJSONObject(val));
      }
    } else {
      result.push(val);
    }
  }
  return result;
}

export const sortJSONObject = (o: TObject) => {
  const result: TObject = {};
  const keys = Object.keys(o).sort();
  for (let key of keys) {
    const val = o[key];
    if (val && typeof val === 'object') {
      if(Array.isArray(val)) {
        result[key] = sortJSONArray(val);
      } else {
        result[key] = sortJSONObject(val);
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}

export const sortJSON = (o: any) => {
  if (o && typeof o === 'object') {
    if (Array.isArray(o)) {
      return sortJSONArray(o);
    } else {
      return sortJSONObject(o);
    }
  }
  return o;
}
