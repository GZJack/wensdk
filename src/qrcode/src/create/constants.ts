export const QRMode = {
  _MODE_NUMBER: 1 << 0,
  _MODE_ALPHA_NUM: 1 << 1,
  _MODE_8BIT_BYTE: 1 << 2,
  _MODE_KANJI: 1 << 3
}

export const QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
}

export const QRMaskPattern = {
  _PATTERN000: 0,
  _PATTERN001: 1,
  _PATTERN010: 2,
  _PATTERN011: 3,
  _PATTERN100: 4,
  _PATTERN101: 5,
  _PATTERN110: 6,
  _PATTERN111: 7
}
