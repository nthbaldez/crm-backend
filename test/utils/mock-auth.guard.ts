import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class MockAuthGuard implements CanActivate {
	static userIdToInject: string | null = null

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		// Sempre retorna true para permitir o acesso

		const request = context.switchToHttp().getRequest()

		request.user = {
			sub: MockAuthGuard.userIdToInject,
		}

		return true
	}
}
