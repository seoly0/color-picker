// const template = await load('./template.html')
// console.log(template.getElementById('mytemplate'))


const colorUtils = {

  isHex(color) {
    return /^#([0-9a-fA-F]{3}){1,2}$/i.test(color)
  },

  nameToRgb() {

  },

  nameToHex() {

  },

  rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component"
    return ((r << 16) | (g << 8) | b).toString(16)
  },

  rgbToHsv(rgb) {

  },

  rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255
    var max = Math.max(r, g, b), min = Math.min(r, g, b)
    var h, s, l = (max + min) / 2

    if(max == min){
        h = s = 0 // achromatic
    }else{
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g: h = (b - r) / d + 2
            break
          case b: h = (r - g) / d + 4
            break
        }
        h /= 6
    }

    return [h, s, l]
  },

  hexToRgb() {

  },

  hexToHsv(hex) {
    const r = parseInt(hex.substring(1, 3), 16) / 255
    const g = parseInt(hex.substring(3, 5), 16) / 255
    const b = parseInt(hex.substring(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h
    if (max === min) {
        h = 0
    } else if (max === r) {
        h = 60 * (0 + (g - b) / (max - min))
    } else if (max === g) {
        h = 60 * (2 + (b - r) / (max - min))
    } else if (max === b) {
        h = 60 * (4 + (r - g) / (max - min))
    }
    if (h < 0) h += 360

    const s = max === 0 ? 0 : (max - min) / max
    const v = max

    return { h, s, v }
  },

  hsvToHex(hsv) {
      let r, g, b
      let h = hsv.h / 360
      let s = hsv.s
      let v = hsv.v

      let i = Math.floor(h * 6)
      let f = h * 6 - i
      let p = v * (1 - s)
      let q = v * (1 - f * s)
      let t = v * (1 - (1 - f) * s)

      switch (i % 6) {
        case 0:
          (r = v), (g = t), (b = p)
          break
        case 1:
          (r = q), (g = v), (b = p)
          break
        case 2:
          (r = p), (g = v), (b = t)
          break
        case 3:
          (r = p), (g = q), (b = v)
          break
        case 4:
          (r = t), (g = p), (b = v)
          break
        case 5:
          (r = v), (g = p), (b = q)
          break
      }

      const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }

      return '#' + toHex(r) + toHex(g) + toHex(b)
    },
}

const valueUtils = {
  toInt: (val, _default) => parseInt(val, 10) || _default,
  // isTruthy: (val) => !!val,
  // isFalsy: (val) => !isTruthy(val),
  // isEmpty: (val) => val,
  // isArray: (val) => val,
  // isObject: (val) => val,
  // isFunction: (val) => val,
  // isIn: (val, set) => true,
  // range: (start, len) => Array()
}

export class HSVPicker extends HTMLElement {

  constructor() {
    super()

    this.option = {}
    this.state = {}
    this.pickers = {}
    this.indicators = {}
    // ??
    this.actions = {}
  }

  static get observedAttributes() {
    return ['value']
  }

	attributeChangedCallback(attrName, oldVal, newVal) {

    // if (attrName == 'value') {
    //   this.svSelector.style.background = this.drawSVSelectorCSS(newVal)
    // }
  }

  connectedCallback() {
    this.value = this.getAttribute('value') ?? 'red'
    if ( !!!CSS.supports('color', this.value) ) throw Error('')
    
    this.initOption()
    this.initState()
    this.initPicker()
    this.drawHuePicker()

    if ( this.option.sbCombine ) {
      this.drawSBPicker()
    }
  }

  initOption() {

    this.option.hueDirection = this.getAttribute('hue-direction') ?? 'horizontal'
    this.option.hueType = this.getAttribute('hue-type') ?? 'linear'
    if ( this.option.hueType === 'linear' ) {
      this.option.hueLength = valueUtils.toInt(this.getAttribute('hue-length'), 200)
      this.option.hueThickness = valueUtils.toInt(this.getAttribute('hue-thickness'), 10)
    }
    else if (this.option.hueType === 'circular') {
      // TODO
    }
    this.option.sbCombine = this.hasAttribute('sb-combine')
    if ( this.option.sbCombine ) {
      this.option.sbWidth = valueUtils.toInt(this.getAttribute('sb-width'), 200)
      this.option.sbHeight = valueUtils.toInt(this.getAttribute('sb-height'), 200)
    }
  }

  initState() {

    if ( colorUtils.isHex(this.value) ) {
      const { h, s, v } = colorUtils.hexToHsv(this.value)
      this.state.hue, this.state.saturation, this.state.brightness = colorUtils.hexToHsv(this.value)
      this.state.hue = h
      this.state.saturation = s
      this.state.brightness = v
    }
    else {
      // TODO
    }

    this.state.huePosition = 0
    this.state.saturationPosition = 0
    this.state.brightnessPosition = 0
  }

  initPicker() {
    this.pickers.hue = document.createElement('canvas')
    this.pickers.sb = document.createElement('canvas')

    this.indicators.hue = document.createElement('div')
    this.indicators.sb = document.createElement('div')

    const calcValue = () => {
      // const hCTX = this.pickers.hue.getContext('2d')
      // const [r, g, b] = hCTX.getImageData(this.state.huePosition, 0, 1, 1).data
      // const hueHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)
      // const { h } = colorUtils.hexToHsv(hueHex)
      // this.state.hue = h
    }
    const setH = (evt) => {
      const rect = evt.target.getBoundingClientRect()
      const x = evt.clientX - rect.x
      const y = evt.clientY - rect.y
      
      if (this.option.hueType == 'linear' && this.option.hueDirection == 'horizontal') {
        this.state.huePosition = x
      }
      else if (this.option.hueType == 'linear' && this.option.hueDirection == 'vertical') {
        this.state.huePosition = y
      }
      
      const ctx = this.pickers.hue.getContext('2d')
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
      const hueHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

      const { h } = colorUtils.hexToHsv(hueHex)

      this.state.hue = h
      this.drawSBPicker()
    }
    const setSV = (evt) => {
      const rect = evt.target.getBoundingClientRect()
      const x = evt.clientX - rect.x
      const y = evt.clientY - rect.y

      this.state.saturationPosition = x
      this.state.brightnessPosition = y

      const ctx = this.pickers.sb.getContext('2d')
      // NOTE: x+1, y+1는 rgb값이 좌측상단(하얀색) 클릭시 r,g,b가 0,0,0인 경우 때문
      const [r, g, b] = ctx.getImageData(x + 1, y + 1, 1, 1).data
      const svHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

      const { h, s, v } = colorUtils.hexToHsv(svHex)
      console.log(h,s,v)

      this.value = svHex
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: svHex,
      })
      this.dispatchEvent(inputEvent)
    }

    this.pickers.hue.addEventListener('mousedown', (evt) => {
      this.state.hueSelect = true
    })
    this.pickers.hue.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
    })
    this.pickers.hue.addEventListener('mouseleave', (evt) => {
      this.state.hueSelect = false
    })
    this.pickers.hue.addEventListener('mousemove', (evt) => {
      if (this.state.hueSelect) setH(evt)
    })
    this.pickers.hue.addEventListener('click', (evt) => {
      setH(evt)
    })
    this.pickers.sb.addEventListener('mousedown', (evt) => {
      this.state.sbSelect = true
    })
    this.pickers.sb.addEventListener('mouseup', (evt) => {
      this.state.sbSelect = false
    })
    this.pickers.sb.addEventListener('mouseleave', (evt) => {
      this.state.sbSelect = false
    })
    this.pickers.sb.addEventListener('mousemove', (evt) => {
      if (this.state.sbSelect) setSV(evt)
    })
    this.pickers.sb.addEventListener('click', (evt) => {
      setSV(evt)
    })

    this.appendChild(this.pickers.hue)
    this.appendChild(this.pickers.sb)
  }

  // calcValue() {
  //   const hex = colorUtils.hsvToHex({h: this.state.hue, s: this.state.saturation, b: this.state.brightness})
  //   this.value = hex
  //   const inputEvent = new InputEvent('input', {
  //     bubbles: true,
  //     cancelable: false,
  //     data: hex,
  //   })
  //   this.dispatchEvent(inputEvent)
  // }

  drawHuePicker() {
    
    if ( this.option.hueType === 'linear' && this.option.hueDirection == 'horizontal' ) {
      this.pickers.hue.width = this.option.hueLength
      this.pickers.hue.height = this.option.hueThickness
    }
    else {
      // TODO
    }

    const hueCTX = this.pickers.hue.getContext('2d', { willReadFrequently: true })
    
    const hueGrad = hueCTX.createLinearGradient(0, 0, 200, 0)
    hueGrad.addColorStop(0 / 6, '#ff0000')
    hueGrad.addColorStop(1 / 6, '#ffff00')
    hueGrad.addColorStop(2 / 6, '#00ff00')
    hueGrad.addColorStop(3 / 6, '#00ffff')
    hueGrad.addColorStop(4 / 6, '#0000ff')
    hueGrad.addColorStop(5 / 6, '#ff00ff')
    hueGrad.addColorStop(6 / 6, '#ff0000')

    hueCTX.fillStyle = hueGrad
    hueCTX.fillRect(0, 0, this.option.hueLength, this.option.hueThickness)
  }

  drawSBPicker() {

    // this.pickers.sb.style = 'border: 1px solid grey;'

    if ( this.option.sbCombine ) {
      this.pickers.sb.width = this.option.sbWidth
      this.pickers.sb.height = this.option.sbHeight
    }

    const sbCTX = this.pickers.sb.getContext('2d', { willReadFrequently: true })
    sbCTX.clearRect(0, 0, this.option.sbWidth, this.option.sbHeight)
    sbCTX.globalCompositeOperation = 'multiply'

    const colorGrad = sbCTX.createLinearGradient(0, 0, this.option.sbWidth, 0)
    colorGrad.addColorStop(0.05, "white")
    colorGrad.addColorStop(1, colorUtils.hsvToHex({ h: this.state.hue, s: 1, v: 1 }))
    sbCTX.fillStyle = colorGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

    const blackGrad = sbCTX.createLinearGradient(0, 0, 0, this.option.sbHeight)
    blackGrad.addColorStop(0.1, "white")
    blackGrad.addColorStop(1, "black")
    sbCTX.fillStyle = blackGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

  }
}

// TODO
// 주석좀 달자
// 인디케이터
// 초기값 랜덤
// 휴 변경시에도 값 업데이트
// sv 하얀색 선택할 떄 000000 이 되는 현상