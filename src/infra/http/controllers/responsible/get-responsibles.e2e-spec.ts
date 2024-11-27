import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { ResponsibleAddressFactory } from 'test/factories/make-responsible-address'

describe('E2E -> Get Responsibles', () => {
  let app: INestApplication

  let makeResponsible: ResponsibleFactory
  let makeResponsibleAddress: ResponsibleAddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory, ResponsibleAddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeResponsibleAddress = moduleRef.get(ResponsibleAddressFactory)

    await app.init()
  })

  it('should be able to get Responsibles by attributes', async () => {
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'pass1244',
      phone: '22999995555',
    })

    await makeResponsibleAddress.makePrismaResponsibleAddress({
      responsibleId: createdResponsible.id,
    })

    const createdResponsible2 = await makeResponsible.makePrismaResponsible({
      name: 'Fulano de Tal',
      email: 'fulano.tal@example.com',
      password: 'pass1244',
      phone: '22999995555',
    })
    await makeResponsibleAddress.makePrismaResponsibleAddress({
      responsibleId: createdResponsible2.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/responsibles?phone=22999995555`)
      .send()

    console.log(response.body)

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
