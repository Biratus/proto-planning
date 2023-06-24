import { NextResponse } from "next/server";

export function ok(object: any) {
  return NextResponse.json(object);
}

export function created(object: any) {
  return NextResponse.json(object, { status: 201 });
}

export function notFound(message?: string) {
  return NextResponse.json(
    message
      ? { message: `L'entité n'a pas pu être récupérer : [${message}]` }
      : {},
    { status: 404 }
  );
}

export function serverError(message: string) {
  return NextResponse.json(
    { message: `Une erreur est survenue durant [${message}]` },
    { status: 500 }
  );
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}
