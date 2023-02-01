import type { NextApiRequest, NextApiResponse } from 'next';

export function isPut({ method }:NextApiRequest) {
  return method === "PUT";
}
export function isGet({ method }:NextApiRequest) {
  return method === "GET";
}
export function isPost({ method }:NextApiRequest) {
  return method === "POST";
}
export function isDelete({ method }:NextApiRequest) {
  return method === "DELETE";
}

export function ok(res:NextApiResponse, object:any) {
  return res.status(200).json(object);
}

export function created(res:NextApiResponse, object:any) {
  return res.status(201).json(object);
}

export function notFound(res:NextApiResponse, message:string) {
  if (message)
    return res
      .status(404)
      .json({ message: `L'entité n'a pas pu être récupérer : [${message}]` });
  else res.status(404).send({});
}

export function serverError(res:NextApiResponse, message:string) {
  return res
    .status(500)
    .json({ message: `Une erreur est survenu durant [${message}]` });
}

export function requestError(res:NextApiResponse, message:string) {
  return res.status(400).json({ message });
}

export function parseBool(value:string) {
  return value === "true";
}
