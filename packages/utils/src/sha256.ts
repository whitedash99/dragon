/**
 * Dragon Studios High-Performance FIPS 180-4 Incremental SHA-256 Hasher
 * Bounded memory footprint (never loads complete multi-GB game binaries into RAM).
 */
export class IncrementalSha256 {
  private h0 = 0x6a09e667;
  private h1 = 0xbb67ae85;
  private h2 = 0x3c6ef372;
  private h3 = 0xa54ff53a;
  private h4 = 0x510e527f;
  private h5 = 0x9b05688c;
  private h6 = 0x1f83d9ab;
  private h7 = 0x5be0cd19;

  private buffer: Uint8Array = new Uint8Array(64);
  private bufferLength = 0;
  private totalBytesHashed = 0;
  private isFinalized = false;

  private static readonly K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  private static readonly W = new Uint32Array(64);

  private static rotr(x: number, n: number): number {
    return (x >>> n) | (x << (32 - n));
  }

  private processBlock(block: Uint8Array, offset: number) {
    const W = IncrementalSha256.W;
    const K = IncrementalSha256.K;

    for (let i = 0; i < 16; i++) {
      const idx = offset + i * 4;
      W[i] = (block[idx] << 24) | (block[idx + 1] << 16) | (block[idx + 2] << 8) | block[idx + 3];
    }

    for (let i = 16; i < 64; i++) {
      const s0 = IncrementalSha256.rotr(W[i - 15], 7) ^ IncrementalSha256.rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = IncrementalSha256.rotr(W[i - 2], 17) ^ IncrementalSha256.rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }

    let a = this.h0;
    let b = this.h1;
    let c = this.h2;
    let d = this.h3;
    let e = this.h4;
    let f = this.h5;
    let g = this.h6;
    let h = this.h7;

    for (let i = 0; i < 64; i++) {
      const S1 = IncrementalSha256.rotr(e, 6) ^ IncrementalSha256.rotr(e, 11) ^ IncrementalSha256.rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) | 0;
      const S0 = IncrementalSha256.rotr(a, 2) ^ IncrementalSha256.rotr(a, 13) ^ IncrementalSha256.rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    this.h0 = (this.h0 + a) | 0;
    this.h1 = (this.h1 + b) | 0;
    this.h2 = (this.h2 + c) | 0;
    this.h3 = (this.h3 + d) | 0;
    this.h4 = (this.h4 + e) | 0;
    this.h5 = (this.h5 + f) | 0;
    this.h6 = (this.h6 + g) | 0;
    this.h7 = (this.h7 + h) | 0;
  }

  public update(data: Uint8Array | ArrayBuffer): this {
    if (this.isFinalized) {
      throw new Error("Cannot update finalized SHA-256 digest.");
    }

    const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data);
    let offset = 0;
    let length = uint8.length;
    this.totalBytesHashed += length;

    if (this.bufferLength > 0) {
      const needed = 64 - this.bufferLength;
      if (length >= needed) {
        this.buffer.set(uint8.subarray(0, needed), this.bufferLength);
        this.processBlock(this.buffer, 0);
        offset += needed;
        length -= needed;
        this.bufferLength = 0;
      } else {
        this.buffer.set(uint8, this.bufferLength);
        this.bufferLength += length;
        return this;
      }
    }

    while (length >= 64) {
      this.processBlock(uint8, offset);
      offset += 64;
      length -= 64;
    }

    if (length > 0) {
      this.buffer.set(uint8.subarray(offset), 0);
      this.bufferLength = length;
    }

    return this;
  }

  public digest(): string {
    if (!this.isFinalized) {
      // Append 0x80 padding byte
      this.buffer[this.bufferLength++] = 0x80;

      if (this.bufferLength > 56) {
        this.buffer.fill(0, this.bufferLength, 64);
        this.processBlock(this.buffer, 0);
        this.bufferLength = 0;
      }

      this.buffer.fill(0, this.bufferLength, 56);

      // Append 64-bit length in bits (big-endian)
      const highBits = Math.floor(this.totalBytesHashed / 0x20000000);
      const lowBits = (this.totalBytesHashed * 8) >>> 0;

      this.buffer[56] = (highBits >>> 24) & 0xff;
      this.buffer[57] = (highBits >>> 16) & 0xff;
      this.buffer[58] = (highBits >>> 8) & 0xff;
      this.buffer[59] = highBits & 0xff;
      this.buffer[60] = (lowBits >>> 24) & 0xff;
      this.buffer[61] = (lowBits >>> 16) & 0xff;
      this.buffer[62] = (lowBits >>> 8) & 0xff;
      this.buffer[63] = lowBits & 0xff;

      this.processBlock(this.buffer, 0);
      this.isFinalized = true;
    }

    const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
    return (
      hex(this.h0) +
      hex(this.h1) +
      hex(this.h2) +
      hex(this.h3) +
      hex(this.h4) +
      hex(this.h5) +
      hex(this.h6) +
      hex(this.h7)
    );
  }
}

export interface ChunkedHashingOptions {
  chunkSize?: number; // Default: 16MB (16,777,216 bytes)
  onProgress?: (progressPercent: number, processedBytes: number, totalBytes: number) => void;
}

/**
 * Calculates the SHA-256 checksum of a browser File object using bounded 16MB slices.
 * Never loads the full binary into memory, ensuring zero OOM crashes on 5GB–50GB Unity builds.
 */
export async function computeFileSha256Chunked(
  file: Blob | File,
  options?: ChunkedHashingOptions
): Promise<string> {
  const chunkSize = options?.chunkSize || 16 * 1024 * 1024; // 16MB per chunk
  const totalBytes = file.size;
  const hasher = new IncrementalSha256();

  let offset = 0;

  while (offset < totalBytes) {
    const end = Math.min(offset + chunkSize, totalBytes);
    const chunkBlob = file.slice(offset, end);
    const chunkBuffer = await chunkBlob.arrayBuffer();

    hasher.update(chunkBuffer);
    offset = end;

    if (options?.onProgress) {
      const pct = totalBytes > 0 ? Math.round((offset / totalBytes) * 100) : 100;
      options.onProgress(pct, offset, totalBytes);
    }
  }

  return hasher.digest();
}
