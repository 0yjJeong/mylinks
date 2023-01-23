import urlMetadata from 'url-metadata';

export default class Metadata {
  constructor(private readonly url: string) {}

  async getMetadata() {
    const item = await urlMetadata(this.url);
    if (!item) {
      throw new Error(`Found no metadata with url ${this.url}`);
    }
    return item;
  }
}
