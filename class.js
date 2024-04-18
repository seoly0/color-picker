const getInitiator = (color) => {

  return {
    hex() {
  
    },
    rgb(params) {
      color.r = params.r
      color.g = params.g
      color.b = params.b

      return color
    },
    hsv() {
  
    },
    hsl() {
  
    }
  }
}

class Color {

  set r(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._r = val
    else throw Error
  }
  get r() {return this._r }

  set g(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._g = val
    else throw Error
  }
  get g() {return this._g }

  set b(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._b = val
    else throw Error
  }
  get b() {return this._b }

  set h(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._b = val
    else throw Error
  }
  get h() {return this._b }

  set s(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._b = val
    else throw Error
  }
  get s() {return this._b }

  set v(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._b = val
    else throw Error
  }
  get v() {return this._b }

  set l(val) {
    if (Number.isInteger(val) && val > 0 && val < 255) this._b = val
    else throw Error
  }
  get l() {return this._b }

  constructor() {

  }

  from() {
    return getInitiator(this)
  }
}

// class HSVColor {

// }

// class HSLColor {

// }

// class HexColor {

// }

console.log(new Color().from().rgb({ r: 112, g: 55, b: 201}))