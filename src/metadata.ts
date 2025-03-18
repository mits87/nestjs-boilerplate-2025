/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./modules/users/dto/create-user-request.dto"), { "CreateUserRequestDto": { email: { required: true, type: () => String, format: "email" } } }], [import("./modules/users/dto/update-user-request.dto"), { "UpdateUserRequestDto": {} }]], "controllers": [[import("./modules/users/users.controller"), { "UsersController": { "create": { type: Object }, "list": { type: Object }, "remove": { type: Object }, "show": { type: Object }, "update": { type: Object } } }]] } };
};