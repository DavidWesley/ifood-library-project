import { BasePerson, BasePersonProps } from "@/bases/person.ts"
import { UUID, createUUID } from "@/utils/id.ts"

export interface BaseAuthorProps extends BasePersonProps {
    id: UUID
    email: string
}

export abstract class BaseAuthor extends BasePerson implements BaseAuthorProps {
    public readonly id: UUID
    public readonly email: string

    constructor(author: Omit<BaseAuthorProps, "id">) {
        const { name, birthDate, nationality, email, gender } = author

        if (birthDate > new Date()) {
            throw new RangeError("O autor não pode ter nascido no futuro")
        }

        super({ name, birthDate, nationality, gender })

        this.email = email
        this.id = createUUID()
    }
}
