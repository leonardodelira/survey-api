import { IDecrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements IDecrypter {
      async decrypt(value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_token'))
      }
    }

    const decrypter = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypter, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypter)
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})