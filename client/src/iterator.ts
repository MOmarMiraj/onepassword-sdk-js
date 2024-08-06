export class SdkIterable<T> implements AsyncIterable<T> {
  public constructor(private readonly elements: T[]) {}

  public [Symbol.asyncIterator](): AsyncIterator<T> {
    return this.asyncIterator();
  }

  private async *asyncIterator(): AsyncIterator<T> {
    for (const element of this.elements) {
      yield await Promise.resolve(element);
    }
  }
}
