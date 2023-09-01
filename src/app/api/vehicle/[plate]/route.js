import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request) {
  console.log("La función GET ha sido llamada.");
  try {
    console.log(request);
    const urlParts = request.url.split("/");
    const plate = urlParts[urlParts.length - 1];
    if (!plate) {
      return NextResponse.json(
        { error: "Debes dar la placa del auto" },
        { status: 400 }
      );
    }

    const car = await prisma.vehicle.findUnique({
      where: {
        plate,
      },
      include: {
        category: true,
        specifications: true,
        images: true,
        model: {
          include: true,
          include: {
            brand: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "No se encontró un auto con esa patente" },
        { status: 404 }
      );
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Error al obtener el auto" },
      { status: 500 }
    );
  }
}
//METODO DELETE
export async function DELETE(request) {
  try {
    const urlParts = request.url.split("/");
    const plate = urlParts[urlParts.length - 1];
    if (!plate) {
      return NextResponse.json(
        { error: "Debes proporcionar la placa del auto" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        plate,
      },
      include: {
        images: true,
        specifications: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    await prisma.image.deleteMany({
      where: {
        vehicleIdvehicle: {
          equals: vehicle.idvehicle,
        },
      },
    });

    await prisma.specification.deleteMany({
      where: {
        vehicleIdvehicle: {
          equals: vehicle.idvehicle,
        },
      },
    });

    await prisma.vehicle.delete({
      where: {
        plate,
      },
    });

    return NextResponse.json(
      { message: "Vehículo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Error al eliminar el vehículo" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const urlParts = request.url.split('/');
    const plate = urlParts[urlParts.length - 1];

    const requestData = await request.json();

    const { brand, model, category, specifications, images, ...otherData } = requestData;

    const updatedBrand = brand
      ? { connect: { idbrand: brand.idbrand } } 
      : undefined;

  
    const updatedModel = model
      ? { connect: { idmodel: model.idmodel } } 
      : undefined;

  
    const updatedCategory = category
      ? { connect: { idcategory: category.idcategory } } 
      : undefined;

    const updatedSpecifications = specifications
      ? { connect: specifications.map(spec => ({ idspecification: spec.idspecification })) }
      : undefined;

    const updatedImages = images
      ? { create: images.map(img => ({ url: img.url })) }
      : undefined;

    const updatedCar = await prisma.vehicle.update({
      where: {
        plate,
      },
      data: {
        ...otherData, 
        brand: updatedBrand,
        model: updatedModel,
        category: updatedCategory,
        specifications: updatedSpecifications,
        images: updatedImages,
      },
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Error al modificar el auto" },
      { status: 500 }
    );
  }
}