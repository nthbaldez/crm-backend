import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { HashProviderProps } from './types/hash-props.provider'

@Injectable()
export class HashProvider implements HashProviderProps {
	async hash(password: string): Promise<string> {
		return await hash(password, 8)
	}

	async compare(password: string, password_compared: string): Promise<boolean> {
		return await compare(password, password_compared)
	}
}
