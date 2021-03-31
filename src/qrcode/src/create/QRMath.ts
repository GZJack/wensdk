export const QRMath = {
  _glog (n: number) {
    if (n < 1) {
      throw new Error('glog(' + n + ')')
    }
    return QRMath._LOG_TABLE[n]
  },
  _gexp (n: number) {
    while (n < 0) {
      n += 255
    }
    while (n >= 256) {
      n -= 255
    }
    return QRMath._EXP_TABLE[n]
  },
  _EXP_TABLE: new Array(256),
  _LOG_TABLE: new Array(256)
}

for (let i = 0; i < 8; i++) {
  QRMath._EXP_TABLE[i] = 1 << i
}
for (let i = 8; i < 256; i++) {
  QRMath._EXP_TABLE[i] =
    QRMath._EXP_TABLE[i - 4] ^ QRMath._EXP_TABLE[i - 5] ^ QRMath._EXP_TABLE[i - 6] ^ QRMath._EXP_TABLE[i - 8]
}
for (let i = 0; i < 255; i++) {
  QRMath._LOG_TABLE[QRMath._EXP_TABLE[i]] = i
}
