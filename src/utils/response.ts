import { FastifyReply } from 'fastify';

export const sendSuccess = (
  reply: any,
  data: any = null,
  message :string = "success",
  code : number = 200
) => {
  return reply.code(code).send({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  reply: any,
  message :string =  "something went wrong",
  code : number = 400,
  data: any = null
) => {
  return reply.code(code).send({
    success: false,
    message,
    data,
  });
};

export function handleError(error: any, reply: any) {
  console.error("FULL ERROR STACK:", error?.stack ?? error);
  return reply.code(error?.statusCode ?? 500).send({
    statusCode: error?.statusCode ?? 500,
    error: error?.name ?? "Internal Server Error",
    message: error?.message ?? "Internal Server Error",
  });
}



// export const handleSuccess = (reply: FastifyReply, message: string, data?: any) => {
//   return reply.code(200).send({ success: true, message, data });
// };

// export const responseError = (reply: FastifyReply, message: string, code = 400) => {
//   return reply.code(code).send({ success: false, message });
// };