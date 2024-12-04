import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { SchoolFactory } from 'test/factories/make-school'
import { AddressFactory } from 'test/factories/make-address'
import { JwtService } from '@nestjs/jwt'
import { ResponsibleFactory } from 'test/factories/make-responsible'

describe('E2E -> Get Schools', () => {
  let app: INestApplication

  let makeResponsible: ResponsibleFactory
  let makeSchool: SchoolFactory
  let makeAddress: AddressFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SchoolFactory, ResponsibleFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    makeSchool = moduleRef.get(SchoolFactory)
    makeAddress = moduleRef.get(AddressFactory)
    makeResponsible = moduleRef.get(ResponsibleFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to get Schools by attributes', async () => {
    const createdAddress = await makeAddress.makePrismaAddress({})
    const user = await makeResponsible.makePrismaResponsible({
      addressId: createdAddress.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const addressCreated = await makeAddress.makePrismaAddress({
      street: 'Street Test',
    })

    await makeSchool.makePrismaSchool({
      name: 'Company Test',
      shortName: 'test',
      addressId: addressCreated.id,
    })

    const addressCreated2 = await makeAddress.makePrismaAddress({
      street: 'Street Test 2',
    })

    await makeSchool.makePrismaSchool({
      name: 'Company Test 2',
      shortName: 'test',
      addressId: addressCreated2.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/schools?shortName=test`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body.schools).toHaveLength(2)

    response.body.schools.forEach((school) => {
      expect(school).toBeTypeOf('object')
      expect(school).toHaveProperty('schoolId')
      expect(school.schoolId).toBeTypeOf('string')

      expect(school).toHaveProperty('address')
      expect(school.address).toBeTypeOf('object')
      expect(school.address).toHaveProperty('addressId')
      expect(school.address.addressId).toBeTypeOf('string')
    })
  })
})
