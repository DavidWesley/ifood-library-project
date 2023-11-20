import { BaseAuthor } from "@/bases/author.ts"
import { UUID, createUUID } from "@/utils/id.ts"
import type { TupleToUnion } from "@/utils/types.ts"

const MOST_POPULAR_BOOKS_GENRES = [
    "Adventure",
    "Art & Photography",
    "Biography",
    "Business & Money",
    "Children's Fiction",
    "Cooking",
    "Detective & Mystery",
    "Dystopian",
    "Fantasy",
    "Health & Fitness",
    "Historical Fiction",
    "Horror",
    "LGBTQ+",
    "Memoir & Autobiography",
    "Romance"
] as const

export type BaseBookGenderType = TupleToUnion<typeof MOST_POPULAR_BOOKS_GENRES>

export interface BaseBookProps<A extends BaseAuthor> {
    id: UUID
    title: string
    year: number
    gender: BaseBookGenderType
    author: A
}

export abstract class BaseBook<A extends BaseAuthor = BaseAuthor> implements BaseBookProps<A> {
    public readonly id: UUID
    public readonly title: string
    public readonly year: number
    public readonly gender: BaseBookGenderType
    public readonly author: A

    constructor(book: Omit<BaseBookProps<A>, "id">) {
        const { title, year, gender, author } = book

        if (year < author.birthDate.getUTCFullYear())
            throw new RangeError("O livro não pode ser publicado antes do nascimento do autor")

        if (year > new Date().getUTCFullYear()) throw new RangeError("O livro não pode ser publicado no futuro")

        this.title = title
        this.year = year
        this.gender = gender
        this.author = author

        this.id = createUUID()
    }
}
