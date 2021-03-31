import { QRMath } from './QRMath'

export default class QRPolynomial {

  private _num: any
  constructor (num: any, shift: any) {
    if (num.length == null) {
      throw new Error(num.length + '/' + shift)
    }
    let offset = 0
    while (offset < num.length && num[offset] === 0) {
      offset++
    }
    this._num = new Array(num.length - offset + shift)
    for (let i = 0; i < num.length - offset; i++) {
      this._num[i] = num[i + offset]
    }
  }

  private _get (index: any) {
    return this._num[index]
  }

  public g(index: any){
    return this._get(index);
  }

  private _getLength () {
    return this._num.length
  }

  public l(){
    return this._getLength();
  }

  private _multiply (e: any) {
    const num = new Array(this.l() + e.l() - 1)
    for (let i = 0; i < this.l(); i++) {
      for (let j = 0; j < e.l(); j++) {
        num[i + j] ^= QRMath._gexp(QRMath._glog(this._get(i)) + QRMath._glog(e.g(j)))
      }
    }
    return new QRPolynomial(num, 0)
  }

  public m(e: any){
    return this._multiply(e);
  }

  mod (e: any): any {
    if (this.l() - e.l() < 0) {
      return this
    }
    const ratio = QRMath._glog(this._get(0)) - QRMath._glog(e.g(0))
    const num = new Array(this.l())
    for (let i = 0; i < this.l(); i++) {
      num[i] = this._get(i)
    }
    for (let i = 0; i < e.l(); i++) {
      num[i] ^= QRMath._gexp(QRMath._glog(e.g(i)) + ratio)
    }
    // recursive call
    return new QRPolynomial(num, 0).mod(e)
  }
}
