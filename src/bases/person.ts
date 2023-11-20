export type BasePersonGenderType = "male" | "female" | "other"

export interface BasePersonProps {
    name: string
    birthDate: Date
    nationality: string
    gender: BasePersonGenderType
}

export abstract class BasePerson implements BasePersonProps {
    public readonly name: string
    public readonly birthDate: Date
    public readonly nationality: string
    public readonly gender: BasePersonGenderType

    constructor(person: BasePersonProps) {
        const { name, birthDate, nationality, gender } = person

        this.name = name
        this.birthDate = birthDate
        this.nationality = nationality
        this.gender = gender
    }
}
