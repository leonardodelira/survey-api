export interface ITokenGenerator {
  generate(id: number): Promise<string>;
}
