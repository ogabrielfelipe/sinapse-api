import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-address'

describe('E2E -> Change Password of the an Account Responsible', () => {
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
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      addressId: createdAddress.id,
    })

    const accessToken = jwt.sign({
      sub: createdResponsible.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    const response = await request(app.getHttpServer())
      .patch(`/responsibles/${createdResponsible.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'pass124451',
      })

    expect(response.statusCode).toBe(200)

    const updatedResponsible = await prisma.user.findFirst({
      where: {
        email: createdResponsible.email,
        role: 'RESPONSIBLE',
      },
    })

    expect(updatedResponsible.id).toEqual(expect.any(String))

    expect(updatedResponsible.password).not.toEqual('pass1244')
  })
})
