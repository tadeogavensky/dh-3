import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req, context) {
  console.log("context.params.category :>> ", context.params.name);
  try {
    console.log("entra aca");
    const vehicles = await prisma.vehicle.findMany({
      where: {
        category: {
          name: context.params.name,
        },
      },
      include: {
        category: true,
        model: {
          include: {
            brand: true,
          },
        },
        images: true,
      },
    });

    console.log("vehicles :>> ", vehicles);

    return NextResponse.json(vehicles, { status: 200, data: vehicles });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          message: `Error getting vehicles by category name: ${error.message}`,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error getting vehicles by category name" },
        { status: 500 }
      );
    }
  }
}
