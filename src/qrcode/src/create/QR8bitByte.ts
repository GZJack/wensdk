import { QRMode } from './constants'

export default class QR8bitByte {
  // public _mode: any
  public m:any
  private _data: any

  private _getLength () {
    return this._data.length
  }

  public g(){
    return this._getLength();
  }

  private _write (buffer: any) {
    for (let i = 0; i < this._data.length; i++) {
      // not JIS ...
      buffer.put(this._data.charCodeAt(i), 8)
    }
  }

  public w(buffer: any){
    return this._write(buffer);
  }

  constructor (data: any) {
    // this.mode = QRMode._MODE_8BIT_BYTE
    this.m = QRMode._MODE_8BIT_BYTE
    this._data = data
  }
}
