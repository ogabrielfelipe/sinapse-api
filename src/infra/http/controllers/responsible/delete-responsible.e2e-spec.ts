import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-responsible-address'

describe('E2E -> Delete a Responsible', () => {
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

  it('should be able to change password of the a Responsible', async () => {
    const createdAddress = await makeAddress.makePrismaAddress({})
    const user = await makeResponsible.makePrismaResponsible({
      addressId: createdAddress.id,
    })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'John.Doe@example.com',
      password: 'pass1244',
      addressId: createdAddress.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/responsibles/${createdResponsible.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const updatedResponsible = await prisma.user.findFirst({
      where: {
        id: createdResponsible.id.toString(),
      },
    })

    expect(updatedResponsible).toEqual(null)
  })
})
