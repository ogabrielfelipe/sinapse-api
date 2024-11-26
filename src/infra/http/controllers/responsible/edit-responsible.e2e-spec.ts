import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { ResponsibleAddressFactory } from 'test/factories/make-responsible-address'

describe('E2E -> Edit Account Responsible', () => {
  let app: INestApplication
  let prisma: PrismaService

  let makeResponsible: ResponsibleFactory
  let makeResponsibleAddress: ResponsibleAddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory, ResponsibleAddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeResponsible = moduleRef.get(ResponsibleFactory)
    makeResponsibleAddress = moduleRef.get(ResponsibleAddressFactory)

    await app.init()
  })

  it('should be able to edit a Responsible', async () => {
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'John.Doe@example.com',
    })

    const createdAddress =
      await makeResponsibleAddress.makePrismaResponsibleAddress({
        street: 'name test',
        responsibleId: createdResponsible.id,
      })

    const response = await request(app.getHttpServer())
      .put(`/responsibles/${createdResponsible.id.toString()}`)
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
        userId: updatedResponsible.id,
      },
    })

    expect(updatedResponsible.id).toEqual(expect.any(String))
    expect(updatedAddress.id).toEqual(expect.any(String))

    expect(updatedResponsible.name).toEqual('John Doe Updated')
    expect(updatedAddress.street).toEqual('name test updated')
  })
})
