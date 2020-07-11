export interface IUpdateAccessTokenRepository {
  updateAccessToken(id: number, token: string): Promise<void>;
}
