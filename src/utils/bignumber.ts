import BigNumber from 'bignumber.js'

type Num = string | number

export const Bplus = (num1: Num, num2: Num): number => {
  return Number(new BigNumber(num1).plus(num2).toFixed(8))
}
export const Bminus = (num1: Num, num2: Num): number => {
  return Number(new BigNumber(num1).minus(num2).toFixed(8))
}
export const Bmult = (num1: Num, num2: Num): number => {
  return Number(new BigNumber(num1).times(num2).toFixed(8))
}
export const Bdiv = (num1: Num, num2: Num): number => {
  return Number(new BigNumber(num1).div(num2).toFixed(8))
}
export const Number4 = (num1: Num): Num => {
  if (num1) {
    // 简单处理科学计数
    if (Math.abs(Number(num1)) < 0.00001 && Math.abs(Number(num1)) > 0) {
      return new BigNumber(num1).toFixed(4)
    } else {
      const str = new BigNumber(num1).toFixed(10)
      return str.substr(0, str.length - 6)
      // return Number(str.substr(0, str.length - 6))
    }
  } else if (num1 === 0) {
    return 0
  } else {
    return ''
  }
}

export const Number8 = (num1: Num): Num => {
  if (num1) {
    // 简单处理科学计数
    if (Math.abs(Number(num1)) < 0.00001 && Math.abs(Number(num1)) > 0) {
      return new BigNumber(num1).toFixed(8)
    } else {
      const str = new BigNumber(num1).toFixed(14)
      return Number(str.substr(0, str.length - 6))
    }
  } else if (num1 === 0) {
    return 0
  } else {
    return ''
  }
}

function toThousands(_num: any) {
  _num = (_num || 0).toString()
  const nums = _num.split('.')
  let num = nums[0]
  let result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  nums[0] = result
  return nums.join('.')
}

export const NumberCny = (num1: Num): Num => {
  if (num1) {
    // 简单处理科学计数
    if (Math.abs(Number(num1)) < 0.00001 && Math.abs(Number(num1)) > 0) {
      return toThousands(new BigNumber(num1).toFixed(2))
    } else {
      const str = new BigNumber(num1).toFixed(6)
      return toThousands(Number(str.substr(0, str.length - 4)))
    }
  } else if (num1 === 0) {
    return 0
  } else {
    return ''
  }
}
