import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResponsibleFactory } from 'test/factories/make-responsible'

describe('E2E -> Delete a Responsible', () => {
  let app: INestApplication
  let prisma: PrismaService

  let makeResponsible: ResponsibleFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ResponsibleFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    makeResponsible = moduleRef.get(ResponsibleFactory)

    await app.init()
  })

  it('should be able to change password of the a Responsible', async () => {
    const createdResponsible = await makeResponsible.makePrismaResponsible({
      name: 'John Doe',
      email: 'John.Doe@example.com',
      password: 'pass1244',
    })

    const response = await request(app.getHttpServer())
      .delete(`/responsibles/${createdResponsible.id.toString()}`)
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
