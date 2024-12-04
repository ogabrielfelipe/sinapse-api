import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-address'
import { ResponsibleFactory } from 'test/factories/make-responsible'

describe('E2E -> Create School', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let makeResponsible: ResponsibleFactory
  let makeAddress: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AddressFactory, ResponsibleFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeAddress = moduleRef.get(AddressFactory)
    makeResponsible = moduleRef.get(ResponsibleFactory)
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

    const fakeData = {
      name: 'Empresa Exemplo Ltda',
      shortName: 'Exemplo',
      document: '12345678000195',
      email: 'contato@exemplo.com',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Jardim das Rosas',
        complement: 'Apto 45',
        state: 'SP',
        city: 'São Paulo',
      },
    }

    const response = await request(app.getHttpServer())
      .post(`/schools`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeData)

    expect(response.statusCode).toBe(201)

    const school = await prisma.school.findUnique({
      where: {
        document: '12345678000195',
      },
      include: {
        addresses: true,
      },
    })

    expect(school.id).toEqual(expect.any(String))

    const address = await prisma.address.findUnique({
      where: {
        id: school.addressId,
      },
    })

    expect(address.id).toEqual(expect.any(String))
    expect(address.street).toEqual('Rua das Flores')
  })
})
