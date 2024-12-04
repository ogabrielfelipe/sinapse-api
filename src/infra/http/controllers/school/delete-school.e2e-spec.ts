import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { SchoolFactory } from 'test/factories/make-school'
import { JwtService } from '@nestjs/jwt'
import { AddressFactory } from 'test/factories/make-address'
import { ResponsibleFactory } from 'test/factories/make-responsible'

describe('E2E -> Delete a School', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let makeResponsible: ResponsibleFactory
  let makeSchool: SchoolFactory
  let makeAddress: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SchoolFactory, ResponsibleFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeSchool = moduleRef.get(SchoolFactory)
    makeAddress = moduleRef.get(AddressFactory)
    makeResponsible = moduleRef.get(ResponsibleFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to delete a School', async () => {
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
      .delete(`/schools/${schoolCreated.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const updatedSchool = await prisma.user.findFirst({
      where: {
        id: schoolCreated.id.toString(),
      },
    })

    expect(updatedSchool).toEqual(null)
  })
})
