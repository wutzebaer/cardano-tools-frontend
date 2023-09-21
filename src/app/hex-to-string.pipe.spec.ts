import { HexToStringPipe } from './hex-to-string.pipe';

describe('HexToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new HexToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
