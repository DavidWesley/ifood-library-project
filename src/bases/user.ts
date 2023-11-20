import { BasePerson, BasePersonProps } from "@/bases/person.ts"
import { UUID, createUUID } from "@/utils/id.ts"

export interface BaseUserProps extends BasePersonProps {
    email: string
}

export abstract class BaseUser extends BasePerson implements BaseUserProps {
    public readonly id: UUID
    public readonly email: string

    constructor(user: Omit<BaseUserProps, "id">) {
        const { name, birthDate, nationality, email, gender } = user

        if (birthDate > new Date()) {
            throw new RangeError("O usuário não pode ter nascido no futuro")
        }

        super({ name, birthDate, nationality, gender })

        this.email = email
        this.id = createUUID()
    }
}
