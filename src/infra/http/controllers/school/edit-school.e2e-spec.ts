import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-address'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { SchoolFactory } from 'test/factories/make-school'

describe('E2E -> Edit School', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let makeResponsible: ResponsibleFactory
  let makeSchool: SchoolFactory
  let makeAddress: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AddressFactory, ResponsibleFactory, SchoolFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeAddress = moduleRef.get(AddressFactory)
    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeSchool = moduleRef.get(SchoolFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to create a new School', async () => {
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

    const schoolCreated = await makeSchool.makePrismaSchool({
      name: 'Company Test',
      addressId: addressCreated.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/schools/${schoolCreated.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Company Test Updated',
        shortName: schoolCreated.shortName,
        document: schoolCreated.document.value,
        email: schoolCreated.email,
        isActive: true,
        address: {
          id: addressCreated.id.toString(),
          street: 'Street Test Updated',
          number: addressCreated.number,
          neighborhood: addressCreated.neighborhood,
          complement: addressCreated.complement,
          state: addressCreated.state,
          city: addressCreated.city,
        },
      })

    expect(response.statusCode).toBe(201)

    const school = await prisma.school.findUnique({
      where: {
        document: schoolCreated.document.value,
      },
      include: {
        addresses: true,
      },
    })

    expect(school.id).toEqual(expect.any(String))
    expect(school.name).toEqual('Company Test Updated')

    expect(school.addresses.id).toEqual(expect.any(String))
    expect(school.addresses.street).toEqual('Street Test Updated')
  })
})
