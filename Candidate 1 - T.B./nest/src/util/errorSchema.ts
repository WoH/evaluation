export const defaultErrorSchema = {
  schema: {
    type: "object",
    properties: {
      statusCode: { type: "number" },
      message: {
        anyOf: [
          { type: "string" },
          { type: "array", items: { type: "string" } },
        ],
      },
    },
    required: ["message", "statusCode"],
  },
};
