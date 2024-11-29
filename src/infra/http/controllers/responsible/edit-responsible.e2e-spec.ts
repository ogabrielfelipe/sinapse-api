import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { AddressFactory } from 'test/factories/make-responsible-address'
import { JwtService } from '@nestjs/jwt'

describe('E2E -> Edit Account Responsible', () => {
  let app: INestApplication
  let prisma: PrismaService

  let makeResponsible: ResponsibleFactory
  let makeAddress: AddressFactory
  let jwt: JwtService

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

  it('should be able to edit a Responsible', async () => {
    const address = await makeAddress.makePrismaAddress({})
    const user = await makeResponsible.makePrismaResponsible({
      addressId: address.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const createdAddress = await makeAddress.makePrismaAddress({
      street: 'name test',
    })
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'John.Doe@example.com',
      addressId: createdAddress.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/responsibles/${createdResponsible.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        responsible: {
          name: 'John Doe Updated',
          document: createdResponsible.document.value,
          email: createdResponsible.email,
          phone: createdResponsible.phone,
          isActive: createdResponsible.isActive,
        },
        address: {
          id: createdAddress.id.toString(),
          street: 'name test updated',
          number: createdAddress.number,
          neighborhood: createdAddress.neighborhood,
          complement: createdAddress.complement,
          state: createdAddress.state,
          city: createdAddress.city,
        },
      })

    expect(response.statusCode).toBe(200)

    const updatedResponsible = await prisma.user.findFirst({
      where: {
        email: 'John.Doe@example.com',
        role: 'RESPONSIBLE',
      },
    })

    const updatedAddress = await prisma.address.findFirst({
      where: {
        id: updatedResponsible.addressId,
      },
    })

    expect(updatedResponsible.id).toEqual(expect.any(String))
    expect(updatedAddress.id).toEqual(expect.any(String))

    expect(updatedResponsible.name).toEqual('John Doe Updated')
    expect(updatedAddress.street).toEqual('name test updated')
  })
})
