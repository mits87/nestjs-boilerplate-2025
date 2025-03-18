/* eslint-disable */
export default async () => {
    const t = {
        ["./modules/health/dtos/health-check-response.dto"]: await import("./modules/health/dtos/health-check-response.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./modules/health/dtos/health-check-response.dto"), { "HealthCheckResponseDto": { status: { required: true, type: () => String } } }], [import("./modules/users/dto/create-user-request.dto"), { "CreateUserRequestDto": { email: { required: true, type: () => String, format: "email" } } }], [import("./modules/users/dto/update-user-request.dto"), { "UpdateUserRequestDto": {} }]], "controllers": [[import("./modules/health/health.controller"), { "HealthController": { "ping": { type: t["./modules/health/dtos/health-check-response.dto"].HealthCheckResponseDto } } }], [import("./modules/users/users.controller"), { "UsersController": { "create": { type: Object }, "list": { type: Object }, "remove": { type: Object }, "show": { type: Object }, "update": { type: Object } } }]] } };
};