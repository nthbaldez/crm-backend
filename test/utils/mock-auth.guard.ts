import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class MockAuthGuard implements CanActivate {
	canActivate(
		_context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		// Sempre retorna true para permitir o acesso
		return true
	}
}
