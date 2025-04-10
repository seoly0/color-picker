export const colorUtils = {
  isHex( color: any ) {
    return /^#([0-9a-fA-F]{3}){1,2}$/i.test( color )
  },

  nameToRgb() {
  },

  nameToHex() {
  },

  rgbToHex( r: number, g: number, b: number ) {
    if ( r > 255 || g > 255 || b > 255 ) throw 'Invalid color component'
    return ( ( r << 16 ) | ( g << 8 ) | b ).toString( 16 )
  },

  // rgbToHsv(rgb: any) {

  // },

  // rgbToHsl(r: number, g: number, b: number) {
  //   r /= 255, g /= 255, b /= 255
  //   let max = Math.max(r, g, b), min = Math.min(r, g, b)
  //   let h: number, s: number, l: number = (max + min) / 2

  //   if(max == min){
  //       h = s = 0 // achromatic
  //   }
  //   else{
  //       var d = max - min
  //       s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  //       switch(max){
  //         case r: h = (g - b) / d + (g < b ? 6 : 0)
  //           break
  //         case g: h = (b - r) / d + 2
  //           break
  //         case b: h = (r - g) / d + 4
  //           break
  //       }
  //       h /= 6
  //   }

  //   return [h, s, l]
  // },

  hexToRgb() {
  },

  hexToHsv( hex: string ) {
    const r = parseInt( hex.substring( 1, 3 ), 16 ) / 255
    const g = parseInt( hex.substring( 3, 5 ), 16 ) / 255
    const b = parseInt( hex.substring( 5, 7 ), 16 ) / 255

    const max = Math.max( r, g, b )
    const min = Math.min( r, g, b )

    let h: number
    if ( max === min ) {
      h = 0
    }
    else if ( max === r ) {
      h = 60 * ( 0 + ( g - b ) / ( max - min ) )
    }
    else if ( max === g ) {
      h = 60 * ( 2 + ( b - r ) / ( max - min ) )
    }
    else if ( max === b ) {
      h = 60 * ( 4 + ( r - g ) / ( max - min ) )
    }
    else {
      throw Error
    }
    if ( h < 0 ) h += 360

    const s = max === 0 ? 0 : ( max - min ) / max
    const v = max

    return { h, s, v }
  },

  hsvToHex( hsv: any ) {
    let r, g, b
    let h = hsv.h / 360
    let s = hsv.s
    let v = hsv.v

    let i = Math.floor( h * 6 )
    let f = h * 6 - i
    let p = v * ( 1 - s )
    let q = v * ( 1 - f * s )
    let t = v * ( 1 - ( 1 - f ) * s )

    switch ( i % 6 ) {
      case 0:
        ;( r = v ), ( g = t ), ( b = p )
        break
      case 1:
        ;( r = q ), ( g = v ), ( b = p )
        break
      case 2:
        ;( r = p ), ( g = v ), ( b = t )
        break
      case 3:
        ;( r = p ), ( g = q ), ( b = v )
        break
      case 4:
        ;( r = t ), ( g = p ), ( b = v )
        break
      case 5:
        ;( r = v ), ( g = p ), ( b = q )
        break
    }

    const toHex = ( x: number ) => {
      const hex = Math.round( x * 255 ).toString( 16 )
      return hex.length === 1 ? '0' + hex : hex
    }

    return '#' + toHex( r ) + toHex( g ) + toHex( b )
  },

  hsvToHsl( hsv: any ) {
    let h = hsv.h / 360
    let s = hsv.s
    let v = hsv.v

    let l = ( 2 - s ) * v / 2

    if ( l != 0 ) {
      if ( l == 1 ) {
        s = 0
      }
      else if ( l < 0.5 ) {
        s = s * v / ( l * 2 )
      }
      else {
        s = s * v / ( 2 - l * 2 )
      }
    }

    return { h, s, l }
  },
}

const throwException = ( message?: string ) => {
  throw Error( message )
}

export const valueUtils = {
  assert: <T>( val: any, domains: Array<T>, _default?: T ): T => domains.find( x => x == val ) || _default || throwException(),
  toInt: ( val: any, _default: number ) => parseInt( val, 10 ) || _default,
  // isTruthy: (val) => !!val,
  // isFalsy: (val) => !isTruthy(val),
  // isEmpty: (val) => val,
  // isArray: (val) => val,
  // isObject: (val) => val,
  // isFunction: (val) => val,
  // isIn: (val, set) => true,
  // range: (start, len) => Array()
}
