import { BadRequestException, PipeTransform } from '@nestjs/common'
import z, { ZodError, ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodType) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value)
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					errors: z.prettifyError(error),
					message: 'Validation failed.',
					statusCode: 400,
				})
			}
		}

		return value
	}
}
