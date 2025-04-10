var k = Object.defineProperty;
var v = (r, o, t) => o in r ? k(r, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[o] = t;
var b = (r, o, t) => v(r, typeof o != "symbol" ? o + "" : o, t);
const h = {
  isHex(r) {
    return /^#([0-9a-fA-F]{3}){1,2}$/i.test(r);
  },
  nameToRgb() {
  },
  nameToHex() {
  },
  rgbToHex(r, o, t) {
    if (r > 255 || o > 255 || t > 255) throw "Invalid color component";
    return (r << 16 | o << 8 | t).toString(16);
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
  hexToHsv(r) {
    const o = parseInt(r.substring(1, 3), 16) / 255, t = parseInt(r.substring(3, 5), 16) / 255, e = parseInt(r.substring(5, 7), 16) / 255, s = Math.max(o, t, e), n = Math.min(o, t, e);
    let i;
    if (s === n)
      i = 0;
    else if (s === o)
      i = 60 * (0 + (t - e) / (s - n));
    else if (s === t)
      i = 60 * (2 + (e - o) / (s - n));
    else if (s === e)
      i = 60 * (4 + (o - t) / (s - n));
    else
      throw Error;
    i < 0 && (i += 360);
    const c = s === 0 ? 0 : (s - n) / s;
    return { h: i, s: c, v: s };
  },
  hsvToHex(r) {
    let o, t, e, s = r.h / 360, n = r.s, i = r.v, c = Math.floor(s * 6), u = s * 6 - c, l = i * (1 - n), p = i * (1 - u * n), d = i * (1 - (1 - u) * n);
    switch (c % 6) {
      case 0:
        o = i, t = d, e = l;
        break;
      case 1:
        o = p, t = i, e = l;
        break;
      case 2:
        o = l, t = i, e = d;
        break;
      case 3:
        o = l, t = p, e = i;
        break;
      case 4:
        o = d, t = l, e = i;
        break;
      case 5:
        o = i, t = l, e = p;
        break;
    }
    const g = (m) => {
      const y = Math.round(m * 255).toString(16);
      return y.length === 1 ? "0" + y : y;
    };
    return "#" + g(o) + g(t) + g(e);
  },
  hsvToHsl(r) {
    let o = r.h / 360, t = r.s, e = r.v, s = (2 - t) * e / 2;
    return s != 0 && (s == 1 ? t = 0 : s < 0.5 ? t = t * e / (s * 2) : t = t * e / (2 - s * 2)), { h: o, s: t, l: s };
  }
}, C = (r) => {
  throw Error(r);
}, a = {
  assert: (r, o, t) => o.find((e) => e == r) || t || C(),
  toInt: (r, o) => parseInt(r, 10) || o
  // isTruthy: (val) => !!val,
  // isFalsy: (val) => !isTruthy(val),
  // isEmpty: (val) => val,
  // isArray: (val) => val,
  // isObject: (val) => val,
  // isFunction: (val) => val,
  // isIn: (val, set) => true,
  // range: (start, len) => Array()
};
class f extends HTMLElement {
  constructor() {
    super();
    b(this, "option");
    b(this, "state");
    b(this, "elems");
    b(this, "value", "");
    this.option = {
      valueType: "hex",
      // hex, rgb
      sbSquare: !1,
      common: {
        picker: {
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          type: "circle",
          size: 16,
          border: {
            thickness: 2,
            color: "white"
          }
        }
      },
      hue: {
        picker: {
          class: "",
          type: "linear",
          direction: "horizontal",
          length: 0,
          thickness: 0,
          radius: 0
        },
        indicator: {
          class: "",
          type: "circle",
          size: 0,
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      saturation: {
        picker: {
          class: "",
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          class: "",
          type: "circle",
          size: 0,
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      brightness: {
        picker: {
          class: "",
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          class: "",
          type: "circle",
          size: 0,
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      selected: {
        show: !1,
        width: 100,
        height: 100
      }
    }, this.state = {
      hue: 0,
      saturation: 0,
      brightness: 0,
      hueHex: "",
      huePosition: 0,
      saturationPosition: 0,
      brightnessPosition: 0,
      hueSelect: !1,
      sbSelect: !1,
      saturationSelect: !1,
      brightnessSelect: !1
    }, this.elems = {};
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback(t, e, s) {
  }
  connectedCallback() {
    if (this.style.position = "relative", this.value = this.getAttribute("value") ?? "red", !CSS.supports("color", this.value)) throw Error(`init value is not valid: ${this.value}`);
    this.value = this.standardize(this.value), this.initOption(), this.initState(), this.initContainer(), this.initSelectedColor(), this.initIndicators(), this.initCanvas(), this.drawHuePicker(), this.option.sbSquare ? this.drawSBPicker() : (this.drawSaturationPicker(), this.drawBrightnessPicker());
  }
  standardize(t) {
    const e = document.createElement("canvas").getContext("2d");
    return e.fillStyle = t, e.fillStyle;
  }
  initOption() {
    this.option.sbSquare = this.hasAttribute("sb-square"), this.option.hue.picker.class = this.getAttribute("hue-picker-class") ?? "hue-picker", this.option.hue.picker.type = a.assert(this.getAttribute("hue-picker-type"), ["linear", "circular"], "linear"), this.option.hue.picker.direction = a.assert(this.getAttribute("hue-picker-direction"), ["horizontal", "vertical"], "horizontal"), this.option.hue.picker.length = a.toInt(this.getAttribute("hue-picker-length"), 200), this.option.hue.picker.thickness = a.toInt(this.getAttribute("hue-picker-thickness"), 10), this.option.hue.picker.radius = a.toInt(this.getAttribute("hue-picker-thickness"), 100), this.option.hue.indicator.class = this.getAttribute("hue-indicator-class") ?? "hue-indicator", this.option.hue.indicator.type = a.assert(this.getAttribute("hue-indicator-type"), ["circle", "rectangle"], "circle"), this.option.hue.indicator.size = a.toInt(this.getAttribute("hue-indicator-size"), 16), this.option.hue.indicator.border.color = this.getAttribute("hue-indicator-border-color") ?? "white", this.option.hue.indicator.border.thickness = a.toInt(this.getAttribute("hue-indicator-border-thickness"), 2), this.option.saturation.picker.class = this.getAttribute("saturation-picker-class") ?? "saturation-picker", this.option.saturation.picker.direction = a.assert(this.getAttribute("saturation-picker-direction"), ["horizontal", "vertical"], "horizontal"), this.option.saturation.picker.length = a.toInt(this.getAttribute("saturation-picker-length"), 200), this.option.saturation.picker.thickness = a.toInt(this.getAttribute("saturation-picker-thickness"), 10), this.option.saturation.indicator.class = this.getAttribute("saturation-indicator-class") ?? "saturation-indicator", this.option.saturation.indicator.type = a.assert(this.getAttribute("saturation-indicator-type"), ["circle", "rectangle"], "circle"), this.option.saturation.indicator.size = a.toInt(this.getAttribute("saturation-indicator-size"), 16), this.option.saturation.indicator.border.color = this.getAttribute("saturation-indicator-border-color") ?? "white", this.option.saturation.indicator.border.thickness = a.toInt(this.getAttribute("saturation-indicator-border-thickness"), 2), this.option.brightness.picker.class = this.getAttribute("brightness-picker-class") ?? "brightness-picker", this.option.brightness.picker.direction = a.assert(this.getAttribute("brightness-picker-direction"), ["horizontal", "vertical"], "horizontal"), this.option.brightness.picker.length = a.toInt(this.getAttribute("brightness-picker-length"), 200), this.option.brightness.picker.thickness = a.toInt(this.getAttribute("brightness-picker-thickness"), 10), this.option.brightness.indicator.class = this.getAttribute("brightness-indicator-class") ?? "brightness-indicator", this.option.brightness.indicator.type = a.assert(this.getAttribute("brightness-indicator-type"), ["circle"], "circle"), this.option.brightness.indicator.size = a.toInt(this.getAttribute("brightness-indicator-size"), 16), this.option.brightness.indicator.border.color = this.getAttribute("brightness-indicator-border-color") ?? "white", this.option.brightness.indicator.border.thickness = a.toInt(this.getAttribute("brightness-indicator-border-thickness"), 2);
  }
  initState() {
    if (h.isHex(this.value)) {
      const { h: t, s: e, v: s } = h.hexToHsv(this.value);
      this.state.hue = t, this.state.saturation = e, this.state.brightness = s, this.state.hueHex = h.hsvToHex({ h: t, s: 1, v: 1 }), this.state.huePosition = t / 360 * this.option.hue.picker.length, this.state.saturationPosition = e * this.option.saturation.picker.length;
      const n = this.option.sbSquare ? 1 - s : s;
      this.state.brightnessPosition = n * this.option.brightness.picker.length;
    }
  }
  dispatch() {
    const t = h.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: this.state.brightness });
    this.value = t;
    const e = new InputEvent("input", {
      bubbles: !0,
      cancelable: !1,
      data: t
    });
    this.dispatchEvent(e);
  }
  initContainer() {
    this.elems.hueContainer = document.createElement("div"), this.elems.hueContainer.classList.add(this.option.hue.picker.class), this.elems.hueContainer.style.position = "relative", this.elems.hueContainer.style.lineHeight = "0", this.appendChild(this.elems.hueContainer), this.option.sbSquare ? (this.elems.sbContainer = document.createElement("div"), this.elems.sbContainer.style.position = "relative", this.elems.sbContainer.style.lineHeight = "0", this.appendChild(this.elems.sbContainer)) : (this.elems.saturationContainer = document.createElement("div"), this.elems.saturationContainer.classList.add(this.option.saturation.picker.class), this.elems.saturationContainer.style.position = "relative", this.elems.saturationContainer.style.lineHeight = "0", this.appendChild(this.elems.saturationContainer), this.elems.brightnessContainer = document.createElement("div"), this.elems.brightnessContainer.classList.add(this.option.brightness.picker.class), this.elems.brightnessContainer.style.position = "relative", this.elems.brightnessContainer.style.lineHeight = "0", this.appendChild(this.elems.brightnessContainer));
  }
  initSelectedColor() {
    this.option.selected.show && (this.elems.selectedColor = document.createElement("div"), this.elems.selectedColor.style.position = "relative", this.elems.selectedColor.style.width = `${this.option.selected.width}px`, this.elems.selectedColor.style.height = `${this.option.selected.height}px`, this.elems.selectedColor.style.backgroundColor = this.value, this.appendChild(this.elems.selectedColor));
  }
  drawSelectedColor() {
    this.option.selected.show && (this.elems.selectedColor.style.backgroundColor = this.value);
  }
  setHue(t, e) {
    const s = this.elems.hueCanvas.getBoundingClientRect();
    let n = t - s.x, i = e - s.y;
    n = n > 0 ? n : 0, i = i > 0 ? i : 0, n = n < s.width ? n : s.width - 1, i = i < s.height ? i : s.height - 1, this.option.hue.picker.type == "linear" && this.option.hue.picker.direction == "horizontal" ? this.state.huePosition = n : this.option.hue.picker.type == "linear" && this.option.hue.picker.direction == "vertical" && (this.state.huePosition = i);
    const c = this.elems.hueCanvas.getContext("2d"), [u, l, p] = c.getImageData(n, i, 1, 1).data, d = "#" + ("000000" + h.rgbToHex(u, l, p)).slice(-6), { h: g } = h.hexToHsv(d);
    this.state.hue = g, this.state.hueHex = d, this.dispatch(), this.drawHueIndicator(), this.option.sbSquare ? (this.drawSBIndicator(), this.drawSBPicker()) : (this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator()), this.drawSelectedColor();
  }
  setSaturation(t, e) {
    const s = this.elems.saturationCanvas.getBoundingClientRect();
    let n = t - s.x, i = e - s.y;
    n = n > 0 ? n : 0, i = i > 0 ? i : 0, n = n < s.width ? n : s.width - 1, i = i < s.height ? i : s.height - 1, this.option.saturation.picker.direction == "horizontal" ? this.state.saturationPosition = n : this.option.saturation.picker.direction == "vertical" && (this.state.saturationPosition = i), this.state.saturation = this.state.saturationPosition / this.option.saturation.picker.length, this.dispatch(), this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator();
  }
  setBrightness(t, e) {
    const s = this.elems.brightnessCanvas.getBoundingClientRect();
    let n = t - s.x, i = e - s.y;
    n = n > 0 ? n : 0, i = i > 0 ? i : 0, n = n < s.width ? n : s.width - 1, i = i < s.height ? i : s.height - 1, this.option.brightness.picker.direction == "horizontal" ? this.state.brightnessPosition = n : this.option.brightness.picker.direction == "vertical" && (this.state.brightnessPosition = i), this.state.brightness = this.state.brightnessPosition / this.option.brightness.picker.length, this.dispatch(), this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator();
  }
  setSB(t, e) {
    const s = this.elems.sbCanvas.getBoundingClientRect();
    let n = t - s.x, i = e - s.y;
    n = n > 0 ? n : 0, i = i > 0 ? i : 0, n = n < s.width ? n : s.width - 1, i = i < s.height ? i : s.height - 1, this.state.saturationPosition = n, this.state.brightnessPosition = i;
    const c = this.elems.sbCanvas.getContext("2d"), [u, l, p] = c.getImageData(n, i, 1, 1).data, d = "#" + ("000000" + h.rgbToHex(u, l, p)).slice(-6), { s: g, v: m } = h.hexToHsv(d);
    this.state.saturation = g, this.state.brightness = m, this.dispatch(), this.drawHueIndicator(), this.drawSBIndicator(), this.drawSelectedColor();
  }
  initCanvas() {
    this.elems.hueCanvas = document.createElement("canvas"), this.elems.hueCanvas.addEventListener("mousedown", (t) => {
      this.setHue(t.clientX, t.clientY), this.state.hueSelect = !0, this.elems.hueDragArea.style.display = "block";
    }), this.elems.hueCanvas.addEventListener("mouseup", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none";
    }), this.elems.hueContainer.appendChild(this.elems.hueCanvas), this.option.sbSquare ? (this.elems.sbCanvas = document.createElement("canvas"), this.elems.sbCanvas.addEventListener("mousedown", (t) => {
      this.setSB(t.clientX, t.clientY), this.state.sbSelect = !0, this.elems.sbDragArea.style.display = "block";
    }), this.elems.sbCanvas.addEventListener("mouseup", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none";
    }), this.elems.sbContainer.appendChild(this.elems.sbCanvas)) : (this.elems.saturationCanvas = document.createElement("canvas"), this.elems.saturationCanvas.addEventListener("mousedown", (t) => {
      this.setSaturation(t.clientX, t.clientY), this.state.saturationSelect = !0, this.elems.saturationDragArea.style.display = "block";
    }), this.elems.saturationCanvas.addEventListener("mouseup", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none";
    }), this.elems.saturationContainer.appendChild(this.elems.saturationCanvas), this.elems.brightnessCanvas = document.createElement("canvas"), this.elems.brightnessCanvas.addEventListener("mousedown", (t) => {
      this.setBrightness(t.clientX, t.clientY), this.state.brightnessSelect = !0, this.elems.brightnessDragArea.style.display = "block";
    }), this.elems.brightnessCanvas.addEventListener("mouseup", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none";
    }), this.elems.brightnessContainer.appendChild(this.elems.brightnessCanvas));
  }
  initIndicators() {
    this.elems.hueIndicator = document.createElement("div"), this.elems.hueIndicator.classList.add(this.option.hue.indicator.class), this.elems.hueIndicator.style.position = "absolute", this.elems.hueIndicator.style.boxSizing = "border-box", this.elems.hueIndicator.style.zIndex = "1", this.elems.hueIndicator.style.width = `${this.option.hue.indicator.size}px`, this.elems.hueIndicator.style.height = `${this.option.hue.indicator.size}px`, this.elems.hueIndicator.style.border = `${this.option.hue.indicator.border.thickness}px solid ${this.option.hue.indicator.border.color}`, this.elems.hueIndicator.style.borderRadius = "50%", this.elems.hueDragArea = document.createElement("div"), this.elems.hueDragArea.style.position = "fixed", this.elems.hueDragArea.style.width = "100%", this.elems.hueDragArea.style.height = "100%", this.elems.hueDragArea.style.top = "0", this.elems.hueDragArea.style.left = "0", this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.appendChild(this.elems.hueDragArea), this.drawHueIndicator(), this.elems.hueIndicator.addEventListener("mousedown", (t) => {
      this.state.hueSelect = !0, this.elems.hueDragArea.style.display = "block", this.elems.hueIndicator.style.zIndex = "2";
    }), this.elems.hueIndicator.addEventListener("mouseup", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.style.zIndex = "1";
    }), this.elems.hueIndicator.addEventListener("mouseleave", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.style.zIndex = "1";
    }), this.elems.hueIndicator.addEventListener("mousemove", (t) => {
      this.state.hueSelect && this.setHue(t.clientX, t.clientY);
    }), this.elems.hueContainer.appendChild(this.elems.hueIndicator), this.option.sbSquare ? (this.elems.sbIndicator = document.createElement("div"), this.elems.sbIndicator.style.position = "absolute", this.elems.sbIndicator.style.boxSizing = "border-box", this.elems.sbIndicator.style.zIndex = "1", this.elems.sbIndicator.style.width = `${this.option.common.indicator.size}px`, this.elems.sbIndicator.style.height = `${this.option.common.indicator.size}px`, this.elems.sbIndicator.style.border = `${this.option.common.indicator.border.thickness}px solid ${this.option.common.indicator.border.color}`, this.elems.sbIndicator.style.borderRadius = "50%", this.elems.sbDragArea = document.createElement("div"), this.elems.sbDragArea.style.position = "fixed", this.elems.sbDragArea.style.width = "100%", this.elems.sbDragArea.style.height = "100%", this.elems.sbDragArea.style.top = "0", this.elems.sbDragArea.style.left = "0", this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.appendChild(this.elems.sbDragArea), this.drawSBIndicator(), this.elems.sbIndicator.addEventListener("mousedown", (t) => {
      this.state.sbSelect = !0, this.elems.sbDragArea.style.display = "block", this.elems.sbIndicator.style.zIndex = "2";
    }), this.elems.sbIndicator.addEventListener("mouseup", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.style.zIndex = "1";
    }), this.elems.sbIndicator.addEventListener("mouseleave", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.style.zIndex = "1";
    }), this.elems.sbIndicator.addEventListener("mousemove", (t) => {
      this.state.sbSelect && this.setSB(t.clientX, t.clientY);
    }), this.elems.sbContainer.appendChild(this.elems.sbIndicator)) : (this.elems.saturationIndicator = document.createElement("div"), this.elems.saturationIndicator.classList.add(this.option.saturation.indicator.class), this.elems.saturationIndicator.style.position = "absolute", this.elems.saturationIndicator.style.boxSizing = "border-box", this.elems.saturationIndicator.style.zIndex = "1", this.elems.saturationIndicator.style.width = `${this.option.saturation.indicator.size}px`, this.elems.saturationIndicator.style.height = `${this.option.saturation.indicator.size}px`, this.elems.saturationIndicator.style.border = `${this.option.saturation.indicator.border.thickness}px solid ${this.option.saturation.indicator.border.color}`, this.elems.saturationIndicator.style.borderRadius = "50%", this.elems.saturationDragArea = document.createElement("div"), this.elems.saturationDragArea.style.position = "fixed", this.elems.saturationDragArea.style.width = "100%", this.elems.saturationDragArea.style.height = "100%", this.elems.saturationDragArea.style.top = "0", this.elems.saturationDragArea.style.left = "0", this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.appendChild(this.elems.saturationDragArea), this.drawSaturationIndicator(), this.elems.saturationIndicator.addEventListener("mousedown", (t) => {
      this.state.saturationSelect = !0, this.elems.saturationDragArea.style.display = "block", this.elems.saturationIndicator.style.zIndex = "2";
    }), this.elems.saturationIndicator.addEventListener("mouseup", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.style.zIndex = "1";
    }), this.elems.saturationIndicator.addEventListener("mouseleave", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.style.zIndex = "1";
    }), this.elems.saturationIndicator.addEventListener("mousemove", (t) => {
      this.state.saturationSelect && this.setSaturation(t.clientX, t.clientY);
    }), this.elems.saturationContainer.appendChild(this.elems.saturationIndicator), this.elems.brightnessIndicator = document.createElement("div"), this.elems.brightnessIndicator.classList.add(this.option.brightness.indicator.class), this.elems.brightnessIndicator.style.position = "absolute", this.elems.brightnessIndicator.style.boxSizing = "border-box", this.elems.brightnessIndicator.style.zIndex = "1", this.elems.brightnessIndicator.style.width = `${this.option.brightness.indicator.size}px`, this.elems.brightnessIndicator.style.height = `${this.option.brightness.indicator.size}px`, this.elems.brightnessIndicator.style.border = `${this.option.brightness.indicator.border.thickness}px solid ${this.option.brightness.indicator.border.color}`, this.elems.brightnessIndicator.style.borderRadius = "50%", this.elems.brightnessDragArea = document.createElement("div"), this.elems.brightnessDragArea.style.position = "fixed", this.elems.brightnessDragArea.style.width = "100%", this.elems.brightnessDragArea.style.height = "100%", this.elems.brightnessDragArea.style.top = "0", this.elems.brightnessDragArea.style.left = "0", this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.appendChild(this.elems.brightnessDragArea), this.drawBrightnessIndicator(), this.elems.brightnessIndicator.addEventListener("mousedown", (t) => {
      this.state.brightnessSelect = !0, this.elems.brightnessDragArea.style.display = "block", this.elems.brightnessIndicator.style.zIndex = "2";
    }), this.elems.brightnessIndicator.addEventListener("mouseup", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.style.zIndex = "1";
    }), this.elems.brightnessIndicator.addEventListener("mouseleave", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.style.zIndex = "1";
    }), this.elems.brightnessIndicator.addEventListener("mousemove", (t) => {
      this.state.brightnessSelect && this.setBrightness(t.clientX, t.clientY);
    }), this.elems.brightnessContainer.appendChild(this.elems.brightnessIndicator));
  }
  drawHueIndicator() {
    this.option.hue.picker.type === "linear" ? this.option.hue.picker.direction == "horizontal" ? (this.elems.hueIndicator.style.left = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`, this.elems.hueIndicator.style.top = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`) : this.option.hue.picker.direction == "vertical" && (this.elems.hueIndicator.style.left = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`, this.elems.hueIndicator.style.top = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`) : this.option.hue.picker.type, this.elems.hueIndicator.style.backgroundColor = this.state.hueHex;
  }
  drawSBIndicator() {
    this.elems.sbIndicator.style.left = `${this.state.saturationPosition - this.option.common.indicator.size / 2}px`, this.elems.sbIndicator.style.top = `${this.state.brightnessPosition - this.option.common.indicator.size / 2}px`, this.elems.sbIndicator.style.backgroundColor = this.value;
  }
  drawSaturationIndicator() {
    this.elems.saturationIndicator.style.left = `${this.state.saturationPosition - this.option.saturation.indicator.size / 2}px`, this.elems.saturationIndicator.style.top = `${(this.option.saturation.picker.thickness - this.option.saturation.indicator.size) / 2}px`, this.elems.saturationIndicator.style.backgroundColor = this.value;
  }
  drawBrightnessIndicator() {
    this.elems.brightnessIndicator.style.left = `${this.state.brightnessPosition - this.option.brightness.indicator.size / 2}px`, this.elems.brightnessIndicator.style.top = `${(this.option.brightness.picker.thickness - this.option.brightness.indicator.size) / 2}px`, this.elems.brightnessIndicator.style.backgroundColor = this.value;
  }
  drawHuePicker() {
    if (this.option.hue.picker.type === "linear") {
      if (this.option.hue.picker.direction == "horizontal") {
        this.elems.hueCanvas.width = this.option.hue.picker.length, this.elems.hueCanvas.height = this.option.hue.picker.thickness;
        const t = this.elems.hueCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.hue.picker.length, 0);
        e.addColorStop(0 / 6, "#ff0000"), e.addColorStop(1 / 6, "#ffff00"), e.addColorStop(2 / 6, "#00ff00"), e.addColorStop(3 / 6, "#00ffff"), e.addColorStop(4 / 6, "#0000ff"), e.addColorStop(5 / 6, "#ff00ff"), e.addColorStop(6 / 6, "#ff0000"), t.fillStyle = e, t.fillRect(0, 0, this.option.hue.picker.length, this.option.hue.picker.thickness);
      } else if (this.option.hue.picker.direction == "vertical") {
        this.elems.hueCanvas.width = this.option.hue.picker.thickness, this.elems.hueCanvas.height = this.option.hue.picker.length;
        const t = this.elems.hueCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, 0, this.option.hue.picker.length);
        e.addColorStop(0 / 6, "#ff0000"), e.addColorStop(1 / 6, "#ffff00"), e.addColorStop(2 / 6, "#00ff00"), e.addColorStop(3 / 6, "#00ffff"), e.addColorStop(4 / 6, "#0000ff"), e.addColorStop(5 / 6, "#ff00ff"), e.addColorStop(6 / 6, "#ff0000"), t.fillStyle = e, t.fillRect(0, 0, this.option.hue.picker.thickness, this.option.hue.picker.length);
      }
    } else this.option.hue.picker.type;
  }
  drawSaturationPicker() {
    this.elems.saturationCanvas.width = this.option.saturation.picker.length, this.elems.saturationCanvas.height = this.option.saturation.picker.thickness;
    const t = this.elems.saturationCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.saturation.picker.length, 0);
    e.addColorStop(0 / 1, h.hsvToHex({ h: this.state.hue, s: 0, v: this.state.brightness })), e.addColorStop(1 / 1, h.hsvToHex({ h: this.state.hue, s: 1, v: this.state.brightness })), t.fillStyle = e, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.saturation.picker.thickness);
  }
  drawBrightnessPicker() {
    this.elems.brightnessCanvas.width = this.option.brightness.picker.length, this.elems.brightnessCanvas.height = this.option.brightness.picker.thickness;
    const t = this.elems.brightnessCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.brightness.picker.length, 0);
    e.addColorStop(0 / 1, h.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: 0 })), e.addColorStop(1 / 1, h.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: 1 })), t.fillStyle = e, t.fillRect(0, 0, this.option.brightness.picker.length, this.option.brightness.picker.thickness);
  }
  drawSBPicker() {
    this.option.sbSquare && (this.elems.sbCanvas.width = this.option.saturation.picker.length, this.elems.sbCanvas.height = this.option.brightness.picker.length);
    const t = this.elems.sbCanvas.getContext("2d", { willReadFrequently: !0 });
    t.clearRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length), t.globalCompositeOperation = "multiply";
    const e = t.createLinearGradient(0, 0, this.option.saturation.picker.length, 0);
    e.addColorStop(0.02, "white"), e.addColorStop(0.98, h.hsvToHex({ h: this.state.hue, s: 1, v: 1 })), t.fillStyle = e, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length);
    const s = t.createLinearGradient(0, 0, 0, this.option.brightness.picker.length);
    s.addColorStop(0.02, "white"), s.addColorStop(0.98, "black"), t.fillStyle = s, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length);
  }
}
export {
  f as HSVPicker
};
