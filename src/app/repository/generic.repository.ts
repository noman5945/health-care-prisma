import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class GenericRepository<T> {
  private model: keyof typeof prisma;
  private primaryKey: string;
  private externalPrisma?: PrismaClient;

  constructor(model: keyof typeof prisma, primaryKey: string = "id") {
    this.model = model;
    this.primaryKey = primaryKey;
  }

  async createNewData(data: any): Promise<T> {
    return await (prisma[this.model] as any).create({ data });
  }

  // Update a record by ID
  async update(id: string, updateData: any): Promise<T> {
    await (prisma[this.model] as any).findUniqueOrThrow({
      where: { [this.primaryKey]: id },
    });
    return await (prisma[this.model] as any).update({
      where: { [this.primaryKey]: id },
      data: updateData,
    });
  }

  async updateByEmail(email: string, updateData: any) {
    await (prisma[this.model] as any).findUniqueOrThrow({
      where: { email: email },
    });
    return await (prisma[this.model] as any).update({
      where: { email: email },
      data: updateData,
    });
  }

  // Read all records or a single record by ID
  async read(id?: string): Promise<T | T[]> {
    if (id) {
      return await (prisma[this.model] as any).findUniqueOrThrow({
        where: { [this.primaryKey]: id },
      });
    } else {
      return await (prisma[this.model] as any).findMany();
    }
  }
  async readProfileExternal(
    email: string,
    table: keyof typeof prisma
  ): Promise<T> {
    return await (prisma[table] as any).findUniqueOrThrow({
      where: { email: email },
    });
  }

  // Delete a record by ID
  async delete(id: string): Promise<T> {
    await (prisma[this.model] as any).findUniqueOrThrow({
      where: { [this.primaryKey]: id },
    });
    return await (prisma[this.model] as any).delete({
      where: { [this.primaryKey]: id },
    });
  }
}
