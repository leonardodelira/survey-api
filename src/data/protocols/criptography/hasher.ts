export interface IHasher {
  hashe(value: string): Promise<string>;
}
