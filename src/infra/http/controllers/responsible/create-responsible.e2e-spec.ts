import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-address'

describe('E2E -> Create Account Responsible', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let makeResponsible: ResponsibleFactory
  let makeAddress: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeAddress = moduleRef.get(AddressFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to create a new Responsible', async () => {
    const createdAddress = await makeAddress.makePrismaAddress({})
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      addressId: createdAddress.id,
    })

    const accessToken = jwt.sign({
      sub: createdResponsible.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const fakeAccountData = {
      name: 'John Doe',
      document: '57496904074',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'securePassword123',
      address: {
        street: '123 Main St',
        number: '123',
        neighborhood: 'Downtown',
        complement: 'Apt 4B',
        state: 'NY',
        city: 'New York',
      },
    }

    const response = await request(app.getHttpServer())
      .post(`/responsibles`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeAccountData)

    expect(response.statusCode).toBe(201)

    const responsible = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
        role: 'RESPONSIBLE',
      },
      include: {
        addresses: true,
      },
    })

    expect(responsible.id).toEqual(expect.any(String))

    const address = await prisma.address.findUnique({
      where: {
        id: responsible.addressId,
      },
    })

    expect(address.id).toEqual(expect.any(String))
    expect(address.street).toEqual('123 Main St')
  })
})
