

var HEX_CHARS = '0123456789abcdef'.split('');
var EXTRA = [-2147483648, 8388608, 32768, 128];
var SHIFT = [24, 16, 8, 0];
var blocks:Array<any> = [];

export class Sha1{
    /**
     * 块
     *
     * @private
     * @type {Array<any>}
     * @memberof Sha1
     */
    private _blocks:Array<any>;

    private _block:number;
    private _start:number;
    private _bytes:number;
    private _hBytes:number;

    private _h0:number;
    private _h1:number;
    private _h2:number;
    private _h3:number;
    private _h4:number;
    private _h5:number;

    private _finalized:boolean;
    private _hashed:boolean;
    private _first:boolean;


    private _lastByteIndex:number;

    constructor(sharedMemory:boolean){
        if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
            blocks[4] = blocks[5] = blocks[6] = blocks[7] =
            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this._blocks = blocks;
        } else {
            this._blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        
        this._h0 = 0x67452301;
        this._h1 = 0xEFCDAB89;
        this._h2 = 0x98BADCFE;
        this._h3 = 0x10325476;
        this._h4 = 0xC3D2E1F0;
        
        this._block = this._start = this._bytes = this._hBytes = 0;
        this._finalized = this._hashed = false;
        this._first = true;
    }

    update(message:string|any):Sha1|any{

        if (this._finalized) {
            return this;
        }

        let notString = typeof(message) !== 'string';
        if (notString && message.constructor === (window as any).ArrayBuffer) {
            message = new Uint8Array(message);
        }

        let code, index = 0, i, length = message.length || 0, blocks = this._blocks;

        while (index < length) {
            if (this._hashed) {
                this._hashed = false;
                blocks[0] = this._block;
                blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }

            if(notString) {
                for (i = this._start; index < length && i < 64; ++index) {
                    blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                }
            } else {
                for (i = this._start; index < length && i < 64; ++index) {
                    code = message.charCodeAt(index);
                    if (code < 0x80) {
                        blocks[i >> 2] |= code << SHIFT[i++ & 3];
                    } else if (code < 0x800) {
                        blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    } else if (code < 0xd800 || code >= 0xe000) {
                        blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    } else {
                        code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                        blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                }
            }

            this._lastByteIndex = i;
            this._bytes += i - this._start;
            if (i >= 64) {
                this._block = blocks[16];
                this._start = i - 64;
                this.hash();
                this._hashed = true;
            } else {
                this._start = i;
            }
        }
        if (this._bytes > 4294967295) {
            this._hBytes += this._bytes / 4294967296 << 0;
            this._bytes = this._bytes % 4294967296;
        }

        return this;
    }



    finalize():void{
        if (this._finalized) {
            return;
        }
        this._finalized = true;
        let blocks = this._blocks, i = this._lastByteIndex;
        blocks[16] = this._block;
        blocks[i >> 2] |= EXTRA[i & 3];
        this._block = blocks[16];
        if (i >= 56) {
            if (!this._hashed) {
                this.hash();
            }
            blocks[0] = this._block;
            blocks[16] = blocks[1] = blocks[2] = blocks[3] =
            blocks[4] = blocks[5] = blocks[6] = blocks[7] =
            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }
        blocks[14] = this._hBytes << 3 | this._bytes >>> 29;
        blocks[15] = this._bytes << 3;
        this.hash();
    }


    hash():void{
        let a = this._h0, b = this._h1, c = this._h2, d = this._h3, e = this._h4;
        let f, j, t, blocks = this._blocks;

        for(j = 16; j < 80; ++j) {
            t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
            blocks[j] =  (t << 1) | (t >>> 31);
        }

        for(j = 0; j < 20; j += 5) {
            f = (b & c) | ((~b) & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1518500249 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | ((~a) & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1518500249 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | ((~e) & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1518500249 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | ((~d) & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1518500249 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | ((~c) & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1518500249 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 40; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1859775393 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1859775393 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1859775393 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1859775393 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1859775393 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 60; j += 5) {
            f = (b & c) | (b & d) | (c & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 1894007588 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | (a & c) | (b & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 1894007588 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | (e & b) | (a & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 1894007588 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | (d & a) | (e & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 1894007588 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | (c & e) | (d & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 1894007588 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 80; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 899497514 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 899497514 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 899497514 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 899497514 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 899497514 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        this._h0 = this._h0 + a << 0;
        this._h1 = this._h1 + b << 0;
        this._h2 = this._h2 + c << 0;
        this._h3 = this._h3 + d << 0;
        this._h4 = this._h4 + e << 0;
    }


    hex():string{

        this.finalize();

        let h0 = this._h0, h1 = this._h1, h2 = this._h2, h3 = this._h3, h4 = this._h4;

        return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
            HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
            HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
            HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
            HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
            HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
            HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
            HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
            HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
            HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
            HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
            HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
            HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
            HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
            HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
            HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
            HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
            HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
            HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
            HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
    }

    toString():string{
        return this.hex();
    }


    digest():Array<any>{
        this.finalize();

        let h0 = this._h0, h1 = this._h1, h2 = this._h2, h3 = this._h3, h4 = this._h4;

        return [
            (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
            (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
            (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
            (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
            (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
        ];
    }


    array():Array<any>{
        return this.digest();
    }

    arrayBuffer():ArrayBuffer{
        this.finalize();

        let buffer = new ArrayBuffer(20);
        let dataView = new DataView(buffer);
        dataView.setUint32(0, this._h0);
        dataView.setUint32(4, this._h1);
        dataView.setUint32(8, this._h2);
        dataView.setUint32(12, this._h3);
        dataView.setUint32(16, this._h4);
        return buffer;
    }

}