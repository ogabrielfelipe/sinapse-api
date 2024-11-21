import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'

describe('E2E -> Create Account Responsible', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('should be able to create a new Responsible', async () => {
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
      .post(`/accounts`)
      .send(fakeAccountData)

    expect(response.statusCode).toBe(201)

    const responsible = await prisma.user.findFirst({
      where: {
        email: 'john.doe@example.com',
        role: 'RESPONSIBLE',
      },
      include: {
        address: true,
      },
    })

    expect(responsible.id).toEqual(expect.any(String))

    const address = await prisma.address.findFirst({
      where: {
        id: responsible.addressId,
      },
    })

    expect(address.id).toEqual(expect.any(String))
    expect(address.street).toEqual('123 Main St')
  })
})
