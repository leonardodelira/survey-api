export interface IUpdateAccessTokenRepository {
  update(id: number, token: string): Promise<void>;
}
