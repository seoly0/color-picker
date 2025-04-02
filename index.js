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

    // 설정값
    this.option = {}

    // 상태값
    this.state = {}

    // HTML 요소
    this.elems = {}

    // ?? 
    this.actions = {}

    this.style.position = 'relative'
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
    this.initContainer()
    this.initIndicators()
    this.initCanvas()
    this.drawHuePicker()
    if ( this.option.sbCombine ) {
      this.drawSBPicker()
    }
  }

  initOption() {

    this.option.hueDirection = this.getAttribute('hue-direction') ?? 'horizontal'
    this.option.hueType = this.getAttribute('hue-type') ?? 'linear'
    this.option.sbCombine = this.hasAttribute('sb-combine')

    if ( this.option.hueType === 'linear' ) {
      this.option.hueLength = valueUtils.toInt(this.getAttribute('hue-length'), 200)
      this.option.hueThickness = valueUtils.toInt(this.getAttribute('hue-thickness'), 10)
    }
    else if (this.option.hueType === 'circular') {
      // TODO
    }
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

      // TODO
      this.state.hueHex = '#000000'
    }
    else {
      // TODO
    }

    // TODO
    // 인디케이터용
    this.state.huePosition = 0
    this.state.saturationPosition = 0
    this.state.brightnessPosition = 0
  }

  dispatch() {
    const hex = colorUtils.hsvToHex({h: this.state.hue, s: this.state.saturation, v: this.state.brightness})

      this.value = hex
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: hex,
      })
      this.dispatchEvent(inputEvent)
  }

  initContainer() {

    // hue 컨테이너 초기화
    this.elems.hueContainer = document.createElement('div')
    this.elems.hueContainer.style.position = 'relative'
    this.elems.hueContainer.style.lineHeight = 0
    this.appendChild(this.elems.hueContainer)

    // sb 컨테이너 초기화
    this.elems.sbContainer = document.createElement('div')
    this.elems.sbContainer.style.position = 'relative'
    this.elems.sbContainer.style.lineHeight = 0
    this.appendChild(this.elems.sbContainer)
  }

  setHue(X, Y) {
    const rect = this.elems.hueCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    if (this.option.hueType == 'linear' && this.option.hueDirection == 'horizontal') {
      this.state.huePosition = x
    }
    else if (this.option.hueType == 'linear' && this.option.hueDirection == 'vertical') {
      this.state.huePosition = y
    }
    
    const ctx = this.elems.hueCanvas.getContext('2d')
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const hueHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

    const { h } = colorUtils.hexToHsv(hueHex)
    this.state.hue = h
    this.state.hueHex = hueHex

    this.dispatch()
    this.drawHueIndicator()
    this.drawSBPicker()
  }

  

  setSB(X, Y) {
    const rect = this.elems.sbCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    this.state.saturationPosition = x
    this.state.brightnessPosition = y

    const ctx = this.elems.sbCanvas.getContext('2d')
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const svHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

    const { s, v } = colorUtils.hexToHsv(svHex)
    this.state.saturation = s
    this.state.brightness = v

    this.dispatch()
    this.drawSBIndicator()
  }

  initCanvas() {
    
    this.elems.hueCanvas = document.createElement('canvas')
    this.elems.hueCanvas.addEventListener('click', (evt) => {
      this.setHue(evt.clientX, evt.clientY)
    })
    this.elems.hueContainer.appendChild(this.elems.hueCanvas)

    this.elems.sbCanvas = document.createElement('canvas')
    this.elems.sbCanvas.addEventListener('click', (evt) => {
      this.setSB(evt.clientX, evt.clientY)
    })
    this.elems.sbContainer.appendChild(this.elems.sbCanvas)
  }

  initIndicators() {
    
    this.elems.hueIndicator = document.createElement('div')
    this.elems.hueIndicator.style.position = 'absolute'
    this.elems.hueIndicator.style.width = '6px'
    this.elems.hueIndicator.style.height = '6px'
    this.elems.hueIndicator.style.border = '2px solid white'
    this.elems.hueIndicator.style.borderRadius = '50%'
    this.elems.hueIndicator.style.top = 0
    this.elems.hueDragArea = document.createElement('div')
    this.elems.hueDragArea.style.position = 'fixed'
    this.elems.hueDragArea.style.width = '100%'
    this.elems.hueDragArea.style.height = '100%'
    this.elems.hueDragArea.style.top = 0
    this.elems.hueDragArea.style.left = 0
    this.elems.hueDragArea.style.display = 'none'
    this.elems.hueIndicator.appendChild(this.elems.hueDragArea)
    this.drawHueIndicator()

    this.elems.hueIndicator.addEventListener('mousedown', (evt) => {
      this.state.hueSelect = true
      this.elems.hueDragArea.style.display = 'block'
    })
    this.elems.hueIndicator.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
    })
    // this.elems.hueIndicator.addEventListener('mouseleave', (evt) => {
    //   this.state.hueSelect = false
    // })
    this.elems.hueIndicator.addEventListener('mousemove', (evt) => {
      if (this.state.hueSelect) this.setHue(evt.clientX, evt.clientY)
    })

    this.elems.hueContainer.appendChild(this.elems.hueIndicator)

    this.elems.sbIndicator = document.createElement('div')
    this.elems.sbIndicator.style.position = 'absolute'
    this.elems.sbIndicator.style.width = '6px'
    this.elems.sbIndicator.style.height = '6px'
    this.elems.sbIndicator.style.border = '2px solid white'
    this.elems.sbIndicator.style.borderRadius = '50%'
    this.elems.sbDragArea = document.createElement('div')
    this.elems.sbDragArea.style.position = 'fixed'
    this.elems.sbDragArea.style.width = '100%'
    this.elems.sbDragArea.style.height = '100%'
    this.elems.sbDragArea.style.top = 0
    this.elems.sbDragArea.style.left = 0
    this.elems.sbDragArea.style.display = 'none'
    this.elems.sbIndicator.appendChild(this.elems.sbDragArea)
    this.drawSBIndicator()

    this.elems.sbIndicator.addEventListener('mousedown', (evt) => {
      this.state.sbSelect = true
      this.elems.sbDragArea.style.display = 'block'
    })
    this.elems.sbIndicator.addEventListener('mouseup', (evt) => {
      this.state.sbSelect = false
      this.elems.sbDragArea.style.display = 'none'
    })
    // this.elems.sbIndicator.addEventListener('mouseleave', (evt) => {
    //   this.state.sbSelect = false
    // })
    this.elems.sbIndicator.addEventListener('mousemove', (evt) => {
      if (this.state.sbSelect) this.setSB(evt.clientX, evt.clientY)
    })

    this.elems.sbContainer.appendChild(this.elems.sbIndicator)
  }

  drawHuePicker() {
    
    if ( this.option.hueType === 'linear' && this.option.hueDirection == 'horizontal' ) {
      this.elems.hueCanvas.width = this.option.hueLength
      this.elems.hueCanvas.height = this.option.hueThickness
    }
    else {
      // TODO
    }

    const hueCTX = this.elems.hueCanvas.getContext('2d', { willReadFrequently: true })
    
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

  drawHueIndicator() {
    this.elems.hueIndicator.style.left = `${this.state.huePosition - 5}px`
    this.elems.hueIndicator.style.backgroundColor = this.state.hueHex
  }

  drawSBIndicator() {
    this.elems.sbIndicator.style.left = `${this.state.saturationPosition - 5}px`
    this.elems.sbIndicator.style.top = `${this.state.brightnessPosition - 5}px`
    this.elems.sbIndicator.style.backgroundColor = this.value
  }

  drawSBPicker() {

    // this.elems.sbCanvas.style = 'border: 1px solid grey;'

    if ( this.option.sbCombine ) {
      this.elems.sbCanvas.width = this.option.sbWidth
      this.elems.sbCanvas.height = this.option.sbHeight
    }

    const sbCTX = this.elems.sbCanvas.getContext('2d', { willReadFrequently: true })
    sbCTX.clearRect(0, 0, this.option.sbWidth, this.option.sbHeight)
    sbCTX.globalCompositeOperation = 'multiply'

    const colorGrad = sbCTX.createLinearGradient(0, 0, this.option.sbWidth, 0)
    colorGrad.addColorStop(0.02, "white")
    colorGrad.addColorStop(0.98, colorUtils.hsvToHex({ h: this.state.hue, s: 1, v: 1 }))
    sbCTX.fillStyle = colorGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

    const blackGrad = sbCTX.createLinearGradient(0, 0, 0, this.option.sbHeight)
    blackGrad.addColorStop(0.02, "white")
    blackGrad.addColorStop(0.98, "black")
    sbCTX.fillStyle = blackGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

  }
}

// TODO
// 주석좀 달자
// 인디케이터
// 초기값 랜덤