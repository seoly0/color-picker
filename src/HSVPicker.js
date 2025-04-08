import { colorUtils, valueUtils } from './utils.js'

export class HSVPicker extends HTMLElement {

  constructor() {
    super()

    // 설정값
    this.option = {
      valueType: 'hex', // hex, rgb

      sbSquare: false,

      global: {
        picker: {
          direction: 'horizontal',
          length: 0,
          thickness: 0,
        },
        indicator: {
          type: 'circle',
          size: 16,
          border: {
            thickness: 2,
            color: 'white',
          }
        },
      },

      hue: {
        picker: {
          type: 'linear',
          direction: 'horizontal', // lenear
          length: 0, // lenear
          thickness: 0, // lenear, circular
          radius: 0, // circular
        },
        indicator: {
          type: 'circle',
          size: '',
          border: {
            thickness: 0,
            color: 'white',
          }
        },
      },

      saturation: {
        picker: {
          direction: 'horizontal',
          length: 0,
          thickness: 0,
        },
        indicator: {
          type: 'circle',
          size: '',
          border: {
            thickness: 0,
            color: 'white',
          }
        },
      },

      brightness: {
        picker: {
          direction: 'horizontal',
          length: 0,
          thickness: 0,
        },
        indicator: {
          type: 'circle',
          size: '',
          border: {
            thickness: 0,
            color: 'white',
          }
        },
      },
      
      selected: {
        show: false,
        width: 100,
        height: 100,
      },
    }

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
    if ( !!!CSS.supports('color', this.value) ) throw Error(`init value is not valid: ${this.value}`)
    
    this.initOption()
    this.initState()
    this.initContainer()
    this.initSelectedColor()
    this.initIndicators()
    this.initCanvas()

    this.drawHuePicker()
    if ( this.option.sbSquare ) {
      this.drawSBPicker()
    }
    else {
      this.drawSaturationPicker()
      this.drawBrightnessPicker()
    }
  }

  initOption() {
    this.option.sbSquare = this.hasAttribute('sb-square')

    this.option.hue.picker.type = this.getAttribute('hue-picker-direction') ?? 'linear'
    this.option.hue.picker.direction = this.getAttribute('hue-picker-direction') ?? 'horizontal'
    this.option.hue.picker.length = this.getAttribute('hue-picker-length') ?? 200
    this.option.hue.picker.thickness = this.getAttribute('hue-picker-thickness') ?? 10
    this.option.hue.picker.radius = this.getAttribute('hue-picker-thickness') ?? 100
    this.option.hue.indicator.type = this.getAttribute('hue-indicator-type') ?? 'circle'
    this.option.hue.indicator.size = this.getAttribute('hue-indicator-size') ?? 16
    this.option.hue.indicator.border.color = this.getAttribute('hue-indicator-border-color') ?? 'white'
    this.option.hue.indicator.border.thickness = this.getAttribute('hue-indicator-border-thickness') ?? 2

    this.option.saturation.picker.direction = this.getAttribute('saturation-picker-direction') ?? 'horizontal'
    this.option.saturation.picker.length = this.getAttribute('saturation-picker-length') ?? 200
    this.option.saturation.picker.thickness = this.getAttribute('saturation-picker-thickness') ?? 10
    this.option.saturation.indicator.type = this.getAttribute('saturation-indicator-type') ?? 'circle'
    this.option.saturation.indicator.size = this.getAttribute('saturation-indicator-size') ?? 16
    this.option.saturation.indicator.border.color = this.getAttribute('saturation-indicator-border-color') ?? 'white'
    this.option.saturation.indicator.border.thickness = this.getAttribute('saturation-indicator-border-thickness') ?? 2

    this.option.brightness.picker.direction = this.getAttribute('brightness-picker-direction') ?? 'horizontal'
    this.option.brightness.picker.length = this.getAttribute('brightness-picker-length') ?? 200
    this.option.brightness.picker.thickness = this.getAttribute('brightness-picker-thickness') ?? 10
    this.option.brightness.indicator.type = this.getAttribute('brightness-indicator-type') ?? 'circle'
    this.option.brightness.indicator.size = this.getAttribute('brightness-indicator-size') ?? 16
    this.option.brightness.indicator.border.color = this.getAttribute('brightness-indicator-border-color') ?? 'white'
    this.option.brightness.indicator.border.thickness = this.getAttribute('brightness-indicator-border-thickness') ?? 2
  }

  initState() {

    if ( colorUtils.isHex(this.value) ) {
      const { h, s, v } = colorUtils.hexToHsv(this.value)
      this.state.hue, this.state.saturation, this.state.brightness = colorUtils.hexToHsv(this.value)
      this.state.hue = h
      this.state.saturation = s
      this.state.brightness = v

      this.state.hueHex = colorUtils.hsvToHex({ h, s: 1, v: 1 })

      this.state.huePosition = h / 360 * this.option.hue.picker.length
      this.state.saturationPosition = s * this.option.saturation.picker.length
      const dir = this.option.sbSquare ? (1 - v) : v 
      this.state.brightnessPosition = dir * this.option.brightness.picker.length
    }
    else {
      // TODO
    }
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
    if (this.option.sbSquare) {
      this.elems.sbContainer = document.createElement('div')
      this.elems.sbContainer.style.position = 'relative'
      this.elems.sbContainer.style.lineHeight = 0
      this.appendChild(this.elems.sbContainer)
    }
    // 
    else {
      // TODO
      this.elems.saturationContainer = document.createElement('div')
      this.elems.saturationContainer.style.position = 'relative'
      this.elems.saturationContainer.style.lineHeight = 0
      this.appendChild(this.elems.saturationContainer)

      this.elems.brightnessContainer = document.createElement('div')
      this.elems.brightnessContainer.style.position = 'relative'
      this.elems.brightnessContainer.style.lineHeight = 0
      this.appendChild(this.elems.brightnessContainer)
    }
  }

  initSelectedColor() {
    if (this.option.selected.show ) {
      this.elems.selectedColor = document.createElement('div')
      this.elems.selectedColor.style.position = 'relative'
      this.elems.selectedColor.style.width = `${this.option.selected.width}px`
      this.elems.selectedColor.style.height = `${this.option.selected.height}px`
      this.elems.selectedColor.style.backgroundColor = this.value
      this.appendChild(this.elems.selectedColor)
    }
  }

  drawSelectedColor() {
    if (this.option.selected.show ) {
      this.elems.selectedColor.style.backgroundColor = this.value
    }
  }

  setHue(X, Y) {
    const rect = this.elems.hueCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    if (this.option.hue.picker.type == 'linear' && this.option.hue.picker.direction == 'horizontal') {
      this.state.huePosition = x
    }
    else if (this.option.hue.picker.type == 'linear' && this.option.hue.picker.direction == 'vertical') {
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
    if( this.option.sbSquare ) {
      this.drawSBIndicator()
      this.drawSBPicker()
    }
    else {
      this.drawSaturationPicker()
      this.drawSaturationIndicator()
      this.drawBrightnessPicker()
      this.drawBrightnessIndicator()
    }
    this.drawSelectedColor()
  }

  setSaturation(X, Y) {
    const rect = this.elems.saturationCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    if (this.option.saturation.picker.direction == 'horizontal') {
      this.state.saturationPosition = x
    }
    else if (this.option.saturation.picker.direction == 'vertical') {
      this.state.saturationPosition = y
    }
    this.state.saturation = this.state.saturationPosition / this.option.saturation.picker.length
    
    this.dispatch()
    this.drawSaturationPicker()
    this.drawSaturationIndicator()
    this.drawBrightnessPicker()
    this.drawBrightnessIndicator()

  }

  setBrightness(X, Y) {
    const rect = this.elems.brightnessCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    if (this.option.brightness.picker.direction == 'horizontal') {
      this.state.brightnessPosition = x
    }
    else if (this.option.brightness.picker.direction == 'vertical') {
      this.state.brightnessPosition = y
    }
    this.state.brightness = this.state.brightnessPosition / this.option.brightness.picker.length
    
    this.dispatch()
    this.drawSaturationPicker()
    this.drawSaturationIndicator()
    this.drawBrightnessPicker()
    this.drawBrightnessIndicator()
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
    this.drawHueIndicator()
    this.drawSBIndicator()
    this.drawSelectedColor()
  }

  initCanvas() {
    
    // Init hue canvas
    this.elems.hueCanvas = document.createElement('canvas')
    this.elems.hueCanvas.addEventListener('mousedown', (evt) => {
      this.setHue(evt.clientX, evt.clientY)
      this.state.hueSelect = true
      this.elems.hueDragArea.style.display = 'block'
    })
    this.elems.hueCanvas.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
    })
    this.elems.hueContainer.appendChild(this.elems.hueCanvas)

    // Init sb combine canvas
    if (this.option.sbSquare) {
      this.elems.sbCanvas = document.createElement('canvas')
      this.elems.sbCanvas.addEventListener('mousedown', (evt) => {
        this.setSB(evt.clientX, evt.clientY)
        this.state.sbSelect = true
        this.elems.sbDragArea.style.display = 'block'
      })
      this.elems.sbCanvas.addEventListener('mouseup', (evt) => {
        this.state.sbSelect = false
        this.elems.sbDragArea.style.display = 'none'
      })
      this.elems.sbContainer.appendChild(this.elems.sbCanvas)
    }
    // Init sb canvas
    else {
      // TODO
      this.elems.saturationCanvas = document.createElement('canvas')
      this.elems.saturationCanvas.addEventListener('mousedown', (evt) => {
        this.setSaturation(evt.clientX, evt.clientY)
        this.state.saturationSelect = true
        this.elems.saturationDragArea.style.display = 'block'
      })
      this.elems.saturationCanvas.addEventListener('mouseup', (evt) => {
        this.state.saturationSelect = false
        this.elems.saturationDragArea.style.display = 'none'
      })
      this.elems.saturationContainer.appendChild(this.elems.saturationCanvas)

      this.elems.brightnessCanvas = document.createElement('canvas')
      this.elems.brightnessCanvas.addEventListener('mousedown', (evt) => {
        this.setBrightness(evt.clientX, evt.clientY)
        this.state.brightnessSelect = true
        this.elems.brightnessDragArea.style.display = 'block'
      })
      this.elems.brightnessCanvas.addEventListener('mouseup', (evt) => {
        this.state.brightnessSelect = false
        this.elems.brightnessDragArea.style.display = 'none'
      })
      this.elems.brightnessContainer.appendChild(this.elems.brightnessCanvas)
    }
  }

  initIndicators() {
    
    // Init hue indicator
    this.elems.hueIndicator = document.createElement('div')
    this.elems.hueIndicator.style.position = 'absolute'
    this.elems.hueIndicator.style.zIndex = 1
    this.elems.hueIndicator.style.width = `${this.option.hue.indicator.size - this.option.hue.indicator.border.thickness * 2}px`
    this.elems.hueIndicator.style.height = `${this.option.hue.indicator.size - this.option.hue.indicator.border.thickness * 2}px`
    this.elems.hueIndicator.style.border = `${this.option.hue.indicator.border.thickness}px solid ${this.option.hue.indicator.border.color}`
    this.elems.hueIndicator.style.borderRadius = '50%'
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
      this.elems.hueIndicator.style.zIndex = 2
    })
    this.elems.hueIndicator.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
      this.elems.hueIndicator.style.zIndex = 1
    })
    this.elems.hueIndicator.addEventListener('mouseleave', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
      this.elems.hueIndicator.style.zIndex = 1
    })
    this.elems.hueIndicator.addEventListener('mousemove', (evt) => {
      if (this.state.hueSelect) this.setHue(evt.clientX, evt.clientY)
    })
    this.elems.hueContainer.appendChild(this.elems.hueIndicator)

    // Init sb square indicator
    if (this.option.sbSquare) {
      this.elems.sbIndicator = document.createElement('div')
      this.elems.sbIndicator.style.position = 'absolute'
      this.elems.sbIndicator.style.zIndex = 1
      this.elems.sbIndicator.style.width = `${this.option.global.indicator.size - this.option.global.indicator.border.thickness * 2}px`
      this.elems.sbIndicator.style.height = `${this.option.global.indicator.size - this.option.global.indicator.border.thickness * 2}px`
      this.elems.sbIndicator.style.border = `${this.option.global.indicator.border.thickness}px solid ${this.option.global.indicator.border.color}`
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
        this.elems.sbIndicator.style.zIndex = 2
      })
      this.elems.sbIndicator.addEventListener('mouseup', (evt) => {
        this.state.sbSelect = false
        this.elems.sbDragArea.style.display = 'none'
        this.elems.sbIndicator.style.zIndex = 1
      })
      this.elems.sbIndicator.addEventListener('mouseleave', (evt) => {
        this.state.sbSelect = false
        this.elems.sbDragArea.style.display = 'none'
        this.elems.sbIndicator.style.zIndex = 1
      })
      this.elems.sbIndicator.addEventListener('mousemove', (evt) => {
        if (this.state.sbSelect) this.setSB(evt.clientX, evt.clientY)
      })
      this.elems.sbContainer.appendChild(this.elems.sbIndicator)
    }
    else {
      // Init saturation indicator
      this.elems.saturationIndicator = document.createElement('div')
      this.elems.saturationIndicator.style.position = 'absolute'
      this.elems.saturationIndicator.style.zIndex = 1
      this.elems.saturationIndicator.style.width = `${this.option.saturation.indicator.size - this.option.saturation.indicator.border.thickness * 2}px`
      this.elems.saturationIndicator.style.height = `${this.option.saturation.indicator.size - this.option.saturation.indicator.border.thickness * 2}px`
      this.elems.saturationIndicator.style.border = `${this.option.saturation.indicator.border.thickness}px solid ${this.option.saturation.indicator.border.color}`
      this.elems.saturationIndicator.style.borderRadius = '50%'
      this.elems.saturationDragArea = document.createElement('div')
      this.elems.saturationDragArea.style.position = 'fixed'
      this.elems.saturationDragArea.style.width = '100%'
      this.elems.saturationDragArea.style.height = '100%'
      this.elems.saturationDragArea.style.top = 0
      this.elems.saturationDragArea.style.left = 0
      this.elems.saturationDragArea.style.display = 'none'
      this.elems.saturationIndicator.appendChild(this.elems.saturationDragArea)
      this.drawSaturationIndicator()
      this.elems.saturationIndicator.addEventListener('mousedown', (evt) => {
        this.state.saturationSelect = true
        this.elems.saturationDragArea.style.display = 'block'
        this.elems.saturationIndicator.style.zIndex = 2
      })
      this.elems.saturationIndicator.addEventListener('mouseup', (evt) => {
        this.state.saturationSelect = false
        this.elems.saturationDragArea.style.display = 'none'
        this.elems.saturationIndicator.style.zIndex = 1
      })
      this.elems.saturationIndicator.addEventListener('mouseleave', (evt) => {
        this.state.saturationSelect = false
        this.elems.saturationDragArea.style.display = 'none'
        this.elems.saturationIndicator.style.zIndex = 1
      })
      this.elems.saturationIndicator.addEventListener('mousemove', (evt) => {
        if (this.state.saturationSelect) this.setSaturation(evt.clientX, evt.clientY)
      })
      this.elems.saturationContainer.appendChild(this.elems.saturationIndicator)

      // Init brightness indicator
      this.elems.brightnessIndicator = document.createElement('div')
      this.elems.brightnessIndicator.style.position = 'absolute'
      this.elems.brightnessIndicator.style.zIndex = 1
      this.elems.brightnessIndicator.style.width = `${this.option.brightness.indicator.size - this.option.brightness.indicator.border.thickness * 2}px`
      this.elems.brightnessIndicator.style.height = `${this.option.brightness.indicator.size - this.option.brightness.indicator.border.thickness * 2}px`
      this.elems.brightnessIndicator.style.border = `${this.option.brightness.indicator.border.thickness}px solid ${this.option.brightness.indicator.border.color}`
      this.elems.brightnessIndicator.style.borderRadius = '50%'
      this.elems.brightnessDragArea = document.createElement('div')
      this.elems.brightnessDragArea.style.position = 'fixed'
      this.elems.brightnessDragArea.style.width = '100%'
      this.elems.brightnessDragArea.style.height = '100%'
      this.elems.brightnessDragArea.style.top = 0
      this.elems.brightnessDragArea.style.left = 0
      this.elems.brightnessDragArea.style.display = 'none'
      this.elems.brightnessIndicator.appendChild(this.elems.brightnessDragArea)
      this.drawBrightnessIndicator()
      this.elems.brightnessIndicator.addEventListener('mousedown', (evt) => {
        this.state.brightnessSelect = true
        this.elems.brightnessDragArea.style.display = 'block'
        this.elems.brightnessIndicator.style.zIndex = 2
      })
      this.elems.brightnessIndicator.addEventListener('mouseup', (evt) => {
        this.state.brightnessSelect = false
        this.elems.brightnessDragArea.style.display = 'none'
        this.elems.brightnessIndicator.style.zIndex = 1
      })
      this.elems.brightnessIndicator.addEventListener('mouseleave', (evt) => {
        this.state.brightnessSelect = false
        this.elems.brightnessDragArea.style.display = 'none'
        this.elems.brightnessIndicator.style.zIndex = 1
      })
      this.elems.brightnessIndicator.addEventListener('mousemove', (evt) => {
        if (this.state.brightnessSelect) this.setBrightness(evt.clientX, evt.clientY)
      })
      this.elems.brightnessContainer.appendChild(this.elems.brightnessIndicator)
    }
  }

  drawHueIndicator() {
    if ( this.option.hue.picker.type === 'linear' ) {
      if ( this.option.hue.picker.direction == 'horizontal' ) {
        this.elems.hueIndicator.style.left = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`
        this.elems.hueIndicator.style.top = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`
      }
      else if ( this.option.hue.picker.direction == 'vertical') {
        this.elems.hueIndicator.style.left = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`
        this.elems.hueIndicator.style.top = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`
      }
    }
    else if ( this.option.hue.picker.type === 'circular' ) {
      // TODO
    }
    this.elems.hueIndicator.style.backgroundColor = this.state.hueHex
  }

  drawSBIndicator() {
    this.elems.sbIndicator.style.left = `${this.state.saturationPosition - this.option.global.indicator.size / 2}px`
    this.elems.sbIndicator.style.top = `${this.state.brightnessPosition - this.option.global.indicator.size / 2}px`
    this.elems.sbIndicator.style.backgroundColor = this.value
  }

  drawSaturationIndicator() {
    this.elems.saturationIndicator.style.left = `${this.state.saturationPosition - this.option.saturation.indicator.size / 2}px`
    this.elems.saturationIndicator.style.top = `${(this.option.saturation.picker.thickness - this.option.saturation.indicator.size) / 2}px`
    this.elems.saturationIndicator.style.backgroundColor = this.value
  }

  drawBrightnessIndicator() {
    this.elems.brightnessIndicator.style.left = `${this.state.brightnessPosition - this.option.brightness.indicator.size / 2}px`
    this.elems.brightnessIndicator.style.top = `${(this.option.brightness.picker.thickness - this.option.brightness.indicator.size) / 2}px`
    this.elems.brightnessIndicator.style.backgroundColor = this.value
  }

  drawHuePicker() {
    // 선형
    if ( this.option.hue.picker.type === 'linear' ) {
      // 수평
      if ( this.option.hue.picker.direction == 'horizontal' ) {
        this.elems.hueCanvas.width = this.option.hue.picker.length
        this.elems.hueCanvas.height = this.option.hue.picker.thickness

        const hueCTX = this.elems.hueCanvas.getContext('2d', { willReadFrequently: true })
        
        const hueGrad = hueCTX.createLinearGradient(0, 0, this.option.hue.picker.length, 0)
        hueGrad.addColorStop(0 / 6, '#ff0000')
        hueGrad.addColorStop(1 / 6, '#ffff00')
        hueGrad.addColorStop(2 / 6, '#00ff00')
        hueGrad.addColorStop(3 / 6, '#00ffff')
        hueGrad.addColorStop(4 / 6, '#0000ff')
        hueGrad.addColorStop(5 / 6, '#ff00ff')
        hueGrad.addColorStop(6 / 6, '#ff0000')
    
        hueCTX.fillStyle = hueGrad
        hueCTX.fillRect(0, 0, this.option.hue.picker.length, this.option.hue.picker.thickness)
      }
      // 수직
      else if ( this.option.hue.picker.direction == 'vertical' ) {
        this.elems.hueCanvas.width = this.option.hue.picker.thickness
        this.elems.hueCanvas.height = this.option.hue.picker.length

        const hueCTX = this.elems.hueCanvas.getContext('2d', { willReadFrequently: true })
        
        const hueGrad = hueCTX.createLinearGradient(0, 0, 0, this.option.hue.picker.length)
        hueGrad.addColorStop(0 / 6, '#ff0000')
        hueGrad.addColorStop(1 / 6, '#ffff00')
        hueGrad.addColorStop(2 / 6, '#00ff00')
        hueGrad.addColorStop(3 / 6, '#00ffff')
        hueGrad.addColorStop(4 / 6, '#0000ff')
        hueGrad.addColorStop(5 / 6, '#ff00ff')
        hueGrad.addColorStop(6 / 6, '#ff0000')
    
        hueCTX.fillStyle = hueGrad
        hueCTX.fillRect(0, 0,  this.option.hue.picker.thickness, this.option.hue.picker.length)
      }
    }
    // 원형
    else if ( this.option.hue.picker.type === 'circular' ) {
      // TODO
    }
  }

  drawSaturationPicker() {
    this.elems.saturationCanvas.width = this.option.saturation.picker.length
    this.elems.saturationCanvas.height = this.option.saturation.picker.thickness

    const saturationCTX = this.elems.saturationCanvas.getContext('2d', { willReadFrequently: true })
    
    const saturationCTXGrad = saturationCTX.createLinearGradient(0, 0, this.option.saturation.picker.length, 0)
    saturationCTXGrad.addColorStop(0 / 1, colorUtils.hsvToHex({h: this.state.hue, s: 0, v: this.state.brightness}))
    saturationCTXGrad.addColorStop(1 / 1, colorUtils.hsvToHex({h: this.state.hue, s: 1, v: this.state.brightness}))

    saturationCTX.fillStyle = saturationCTXGrad
    saturationCTX.fillRect(0, 0, this.option.saturation.picker.length, this.option.saturation.picker.thickness)
  }

  drawBrightnessPicker() {
    this.elems.brightnessCanvas.width = this.option.brightness.picker.length
    this.elems.brightnessCanvas.height = this.option.brightness.picker.thickness

    const brightnessCTX = this.elems.brightnessCanvas.getContext('2d', { willReadFrequently: true })
    
    const brightnessCTXGrad = brightnessCTX.createLinearGradient(0, 0, this.option.brightness.picker.length, 0)
    brightnessCTXGrad.addColorStop(0 / 1, colorUtils.hsvToHex({h: this.state.hue, s: this.state.saturation, v: 0}))
    brightnessCTXGrad.addColorStop(1 / 1, colorUtils.hsvToHex({h: this.state.hue, s: this.state.saturation, v: 1}))

    brightnessCTX.fillStyle = brightnessCTXGrad
    brightnessCTX.fillRect(0, 0, this.option.brightness.picker.length, this.option.brightness.picker.thickness)
  }

  drawSBPicker() {

    if ( this.option.sbSquare ) {
      this.elems.sbCanvas.width = this.option.saturation.picker.length
      this.elems.sbCanvas.height = this.option.brightness.picker.length
    }

    const sbCTX = this.elems.sbCanvas.getContext('2d', { willReadFrequently: true })
    sbCTX.clearRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length)
    sbCTX.globalCompositeOperation = 'multiply'

    const colorGrad = sbCTX.createLinearGradient(0, 0, this.option.saturation.picker.length, 0)
    colorGrad.addColorStop(0.02, "white")
    colorGrad.addColorStop(0.98, colorUtils.hsvToHex({ h: this.state.hue, s: 1, v: 1 }))
    sbCTX.fillStyle = colorGrad
    sbCTX.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length)

    const blackGrad = sbCTX.createLinearGradient(0, 0, 0, this.option.brightness.picker.length)
    blackGrad.addColorStop(0.02, "white")
    blackGrad.addColorStop(0.98, "black")
    sbCTX.fillStyle = blackGrad
    sbCTX.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length)

  }
}

// TODO
// 주석좀 달자
// 초기값 랜덤