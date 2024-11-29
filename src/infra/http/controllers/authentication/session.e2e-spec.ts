import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { hash } from 'bcryptjs'
import { AddressFactory } from 'test/factories/make-responsible-address'

describe('E2E -> Session', () => {
  let app: INestApplication

  let makeResponsible: ResponsibleFactory
  let makeAddress: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeAddress = moduleRef.get(AddressFactory)

    await app.init()
  })

  it('should be able to create session', async () => {
    const address = await makeAddress.makePrismaAddress({
      street: 'name test',
    })

    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('securePassword123', 8),
      addressId: address.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/auth/session`)
      .send({
        email: createdResponsible.email,
        password: 'securePassword123',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })
})
