import Fastify from "fastify";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

const Student = z.object({
  id: z.coerce.number().optional(),
  name: z.string(),
  age: z.coerce.number(),
  email: z.string(),
  phone: z.string(),
});

const Params = z.object({
  id: z.coerce.number(),
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.get("/students", async (request, reply) => {
  const students = await prisma.student.findMany();

  return students;
});

fastify.get("/students/:id", async (request, reply) => {
  const { id } = Params.parse(request.params);
  const student = await prisma.student.findUnique({ where: { id } });

  return student;
});

fastify.post("/students", async (request, reply) => {
  const studentData = Student.parse(request.body);
  const student = await prisma.student.create({ data: studentData });

  return student;
});

fastify.put("/students/:id", async (request, reply) => {
  const { id } = Params.parse(request.params);
  const studentData = Student.parse(request.body);
  const student = await prisma.student.update({
    where: { id },
    data: studentData,
  });

  return student;
});

fastify.delete("/students/:id", async (request, reply) => {
  const { id } = Params.parse(request.params);
  const student = await prisma.student.delete({ where: { id } });

  return {
    message: student ? "deleted" : "error",
  };
});

async function start() {
  try {
    await fastify.listen({
      host: "0.0.0.0",
      port: Number(process.env.PORT ?? 3000),
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
start();
