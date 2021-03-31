export default class QRBitBuffer {

  // public buffer: Array<number>

  public b:Array<number>;

  private _length: number;

  constructor () {
    // this._buffer = []
    this.b = []
    this._length = 0
  }

  get (index: number) {
    const bufIndex = Math.floor(index / 8)
    // return ((this._buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1
    return ((this.b[bufIndex] >>> (7 - (index % 8))) & 1) === 1
  }

  put (num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this._putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  }

  // private _getLengthInBits () {
  //   return this._length
  // }

  public g(){
    return this._length;
  }


  private _putBit (bit: any) {
    const bufIndex = Math.floor(this._length / 8)
    if (this.b.length <= bufIndex) {
      this.b.push(0)
    }
    if (bit) {
      this.b[bufIndex] |= 0x80 >>> this._length % 8
    }
    this._length++
  }

  public p(bit: any){
    return this._putBit(bit);
  }
}
