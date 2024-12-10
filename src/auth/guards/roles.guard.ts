import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // récupéré via JwtStrategy
    return this.allowedRoles.includes(user.role);
  }
}
