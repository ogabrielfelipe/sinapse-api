import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { AddressFactory } from 'test/factories/make-address'
import { JwtService } from '@nestjs/jwt'

describe('E2E -> Get Responsibles', () => {
  let app: INestApplication

  let makeResponsible: ResponsibleFactory
  let makeAddress: AddressFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeAddress = moduleRef.get(AddressFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to get Responsibles by attributes', async () => {
    const address = await makeAddress.makePrismaAddress({})
    const user = await makeResponsible.makePrismaResponsible({
      addressId: address.id,
    })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const createdAddress = await makeAddress.makePrismaAddress({})

    await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'pass1244',
      phone: '22999995555',
      addressId: createdAddress.id,
    })

    const createdAddress2 = await makeAddress.makePrismaAddress({})

    await makeResponsible.makePrismaResponsible({
      name: 'Fulano de Tal',
      email: 'fulano.tal@example.com',
      password: 'pass1244',
      phone: '22999995555',
      addressId: createdAddress2.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/responsibles?phone=22999995555`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.responsibles).toHaveLength(2)

    response.body.responsibles.forEach((responsible) => {
      expect(responsible).toBeTypeOf('object')
      expect(responsible).toHaveProperty('responsibleId')
      expect(responsible.responsibleId).toBeTypeOf('string')

      expect(responsible).toHaveProperty('address')
      expect(responsible.address).toBeTypeOf('object')
      expect(responsible.address).toHaveProperty('addressId')
      expect(responsible.address.addressId).toBeTypeOf('string')
    })
  })
})
