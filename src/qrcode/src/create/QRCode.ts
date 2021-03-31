import { QRUtil } from './QRUtil'
import QR8bitByte from './QR8bitByte'
import QRBitBuffer from './QRBitBuffer'
import QRRSBlock from './QRRSBlock'
import QRPolynomial from './QRPolynomial'
export {QRErrorCorrectLevel} from './constants'

import {Tools} from '../../lib/Index'

export class QRCode {

  private _typeNumber: number
  private _errorCorrectLevel: number
  private _modules: boolean[][]
  private _moduleCount: number
  private _dataCache: any
  private _dataList: QR8bitByte[]

  constructor (typeNumber: number, errorCorrectLevel: number) {
    this._typeNumber = typeNumber
    this._errorCorrectLevel = errorCorrectLevel
    this._modules = null
    this._moduleCount = 0
    this._dataCache = null
    this._dataList = []
  }

  private _addData (data: any) {
    const newData = new QR8bitByte(data)
    this._dataList.push(newData)
    this._dataCache = null
  }

  public a(data: any){
    return this._addData(data);
  }

  private _isDark (row: number, col: number) {
    if (row < 0 || this._moduleCount <= row || col < 0 || this._moduleCount <= col) {
      throw new Error(row + ',' + col)
    }
    return this._modules[row][col]
  }

  public i(row: number, col: number){
    return this._isDark(row,col);
  }

  // private _getModuleCount () {
  //   return this._moduleCount
  // }

  public g(){
    return this._moduleCount
  }

  make () {
    // Calculate automatically typeNumber if provided is < 1
    if (this._typeNumber < 1) {
      let typeNumber
      for (typeNumber = 1; typeNumber < 40; typeNumber++) {
        const rsBlocks = QRRSBlock._getRSBlocks(typeNumber, this._errorCorrectLevel)

        const buffer = new QRBitBuffer()
        let totalDataCount = 0
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].d
        }

        for (let i = 0; i < this._dataList.length; i++) {
          const data = this._dataList[i]
          buffer.put(data.m, 4)
          buffer.put(data.g(), QRUtil._getLengthInBits(data.m, typeNumber))
          data.w(buffer)
        }
        if (buffer.g() <= totalDataCount * 8) break
      }
      this._typeNumber = typeNumber
    }
    this._makeImpl(false, this._getBestMaskPattern())
  }

  private _makeImpl (test: boolean, maskPattern: number) {
    this._moduleCount = this._typeNumber * 4 + 17
    this._modules = new Array(this._moduleCount)
    for (let row = 0; row < this._moduleCount; row++) {
      this._modules[row] = new Array(this._moduleCount)
      for (let col = 0; col < this._moduleCount; col++) {
        this._modules[row][col] = null
      }
    }

    this._setupPositionProbePattern(0, 0)
    this._setupPositionProbePattern(this._moduleCount - 7, 0)
    this._setupPositionProbePattern(0, this._moduleCount - 7)
    this._setupPositionAdjustPattern()
    this._setupTimingPattern()
    this._setupTypeInfo(test, maskPattern)

    if (this._typeNumber >= 7) {
      this._setupTypeNumber(test)
    }

    if (this._dataCache == null) {
      this._dataCache = QRCode._createData(this._typeNumber, this._errorCorrectLevel, this._dataList)
    }
    this._mapData(this._dataCache, maskPattern)
  }

  private _setupPositionProbePattern (row: any, col: any) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this._moduleCount <= row + r) continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this._moduleCount <= col + c) continue
        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          this._modules[row + r][col + c] = true
        } else {
          this._modules[row + r][col + c] = false
        }
      }
    }
  }

  private _getBestMaskPattern () {
    let minLostPoint = 0
    let pattern = 0
    for (let i = 0; i < 8; i++) {
      this._makeImpl(true, i)
      const lostPoint = QRUtil._getLostPoint(this)
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }
    return pattern
  }

  // 没有用到,不知道什么原因
  // createMovieClip (targetMc: any, instanceName: any, depth: any) {
  //   const qrMc = targetMc.createEmptyMovieClip(instanceName, depth)
  //   const cs = 1
  //   this.make()
  //   for (let row = 0; row < this._modules.length; row++) {
  //     const y = row * cs
  //     for (let col = 0; col < this._modules[row].length; col++) {
  //       const x = col * cs
  //       const dark = this._modules[row][col]
  //       if (dark) {
  //         qrMc.beginFill(0, 100)
  //         qrMc.moveTo(x, y)
  //         qrMc.lineTo(x + cs, y)
  //         qrMc.lineTo(x + cs, y + cs)
  //         qrMc.lineTo(x, y + cs)
  //         qrMc.endFill()
  //       }
  //     }
  //   }
  //   return qrMc
  // }

  private _setupTimingPattern () {
    for (let r = 8; r < this._moduleCount - 8; r++) {
      if (this._modules[r][6] != null) {
        continue
      }
      this._modules[r][6] = r % 2 === 0
    }

    for (let c = 8; c < this._moduleCount - 8; c++) {
      if (this._modules[6][c] != null) {
        continue
      }
      this._modules[6][c] = c % 2 === 0
    }
  }

  private _setupPositionAdjustPattern () {
    const pos = QRUtil._getPatternPosition(this._typeNumber)
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i]
        const col = pos[j]
        if (this._modules[row][col] != null) {
          continue
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this._modules[row + r][col + c] = true
            } else {
              this._modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  }

  private _setupTypeNumber (test: any) {
    const bits = QRUtil._getBCHTypeNumber(this._typeNumber)
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this._modules[Math.floor(i / 3)][(i % 3) + this._moduleCount - 8 - 3] = mod
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this._modules[(i % 3) + this._moduleCount - 8 - 3][Math.floor(i / 3)] = mod
    }
  }

  private _setupTypeInfo (test: any, maskPattern: any) {
    const data = (this._errorCorrectLevel << 3) | maskPattern
    const bits = QRUtil._getBCHTypeInfo(data)
    // vertical
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 6) {
        this._modules[i][8] = mod
      } else if (i < 8) {
        this._modules[i + 1][8] = mod
      } else {
        this._modules[this._moduleCount - 15 + i][8] = mod
      }
    }

    // horizontal
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 8) {
        this._modules[8][this._moduleCount - i - 1] = mod
      } else if (i < 9) {
        this._modules[8][15 - i - 1 + 1] = mod
      } else {
        this._modules[8][15 - i - 1] = mod
      }
    }
    // fixed module
    this._modules[this._moduleCount - 8][8] = !test
  }

  private _mapData (data: any, maskPattern: any) {
    let inc = -1
    let row = this._moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0

    for (let col = this._moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this._modules[row][col - c] == null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }
            const mask = QRUtil._getMask(maskPattern, row, col - c)
            if (mask) {
              dark = !dark
            }
            this._modules[row][col - c] = dark
            bitIndex--
            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }

        row += inc

        if (row < 0 || this._moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }

  static _PAD0 = 0xec
  static _PAD1 = 0x11

  private static _createData (typeNumber: number, errorCorrectLevel: number, dataList: QR8bitByte[]) {
    const rsBlocks: QRRSBlock[] = QRRSBlock._getRSBlocks(typeNumber, errorCorrectLevel)
    const buffer = new QRBitBuffer()
    for (let i = 0; i < dataList.length; i++) {
      const data: QR8bitByte = dataList[i]
      buffer.put(data.m, 4)
      buffer.put(data.g(), QRUtil._getLengthInBits(data.m, typeNumber))
      data.w(buffer)
    }
    // calc num max data.
    let totalDataCount = 0
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].d
    }
    if (buffer.g() > totalDataCount * 8) {
      throw new Error('code length overflow. (' + buffer.g() + '>' + totalDataCount * 8 + ')')
    }
    // end code
    if (buffer.g() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4)
    }
    // padding
    while (buffer.g() % 8 !== 0) {
      buffer.p(false)
    }
    // padding
    while (true) {
      if (buffer.g() >= totalDataCount * 8) {
        break
      }
      buffer.put(QRCode._PAD0, 8)
      if (buffer.g() >= totalDataCount * 8) {
        break
      }
      buffer.put(QRCode._PAD1, 8)
    }
    return QRCode._createBytes(buffer, rsBlocks)
  }

  private static _createBytes (buffer: QRBitBuffer, rsBlocks: QRRSBlock[]) {
    let offset: number = 0
    let maxDcCount: number = 0
    let maxEcCount: number = 0
    const dcdata: number[][] = new Array(rsBlocks.length)
    const ecdata: number[][] = new Array(rsBlocks.length)
    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount: number = rsBlocks[r].d
      const ecCount: number = rsBlocks[r].t - dcCount
      maxDcCount = Math.max(maxDcCount, dcCount)
      maxEcCount = Math.max(maxEcCount, ecCount)
      dcdata[r] = new Array(dcCount)
      for (let i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.b[i + offset]
      }
      offset += dcCount
      const rsPoly: QRPolynomial = QRUtil._getErrorCorrectPolynomial(ecCount)
      const rawPoly: QRPolynomial = new QRPolynomial(dcdata[r], rsPoly.l() - 1)
      const modPoly: QRPolynomial = rawPoly.mod(rsPoly)
      ecdata[r] = new Array(rsPoly.l() - 1)
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex: number = i + modPoly.l() - ecdata[r].length
        ecdata[r][i] = modIndex >= 0 ? modPoly.g(modIndex) : 0
      }
    }

    let totalCodeCount: number = 0
    for (let i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].t
    }

    const data: number[] = new Array(totalCodeCount)
    let index = 0

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i]
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i]
        }
      }
    }
    return data
  }

  /**
   * 创建二维码的入口
   *
   * @static
   * @param {*} options
   * @returns {HTMLCanvasElement}
   * @memberof QRCode
   */
  private static _createCanvas (options: any):HTMLCanvasElement{
    // const opt = Object.assign({
    //   width: 256,
    //   height: 256,
    //   correctLevel: QRErrorCorrectLevel.H,
    //   background: '#ffffff',
    //   foreground: '#000000'
    // }, options)
    const opt:any = Tools._MergeConfig({
      width: 256,
      height: 256,
      correctLevel: 2,
      background: '#ffffff',
      foreground: '#000000'
    }, options);


    const qrcode = new QRCode(-1, opt.correctLevel)
    qrcode.a(opt.text)
    qrcode.make()

    const canvas = document.createElement('canvas')
    canvas.width = opt.width
    canvas.height = opt.height
    const ctx = canvas.getContext('2d')

    const tileW = opt.width / qrcode.g()
    const tileH = opt.height / qrcode.g()
    for (let row = 0; row < qrcode.g(); row++) {
      for (let col = 0; col < qrcode.g(); col++) {
        ctx.fillStyle = qrcode.i(row, col) ? opt.foreground : opt.background
        const w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
        const h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH))
        ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h)
      }
    }

    return canvas
  }

  /**
   * 这是暴露出去的接口
   *
   * @static
   * @param {*} options
   * @returns {HTMLCanvasElement}
   * @memberof QRCode
   */
  public static c(options: any):HTMLCanvasElement{
    return QRCode._createCanvas(options);
  }

  // public static setCanvas (id: string, options: any) {
  //   const parent = document.getElementById(id)
  //   parent.innerHTML = ''
  //   parent.appendChild(QRCode.createCanvas(options))
  // }
}
