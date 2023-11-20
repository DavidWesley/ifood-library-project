import { BaseBook, BaseBookProps } from "@/bases/book.ts"
import { Author } from "@/models/author.ts"
import { UUID, createUUID } from "@/utils/id.ts"

interface BookProps<A extends Author> extends BaseBookProps<A> {
    groupId: UUID
}

export class Book<A extends Author = Author> extends BaseBook<A> implements BookProps<A> {
    public readonly groupId: UUID

    private popularity: number = 0
    private borrowed: boolean = false

    constructor(book: Omit<BaseBook<A>, "id">, familyId?: UUID) {
        const { title, year, gender, author } = book
        super({ title, year, gender, author })

        this.groupId = familyId ?? createUUID()
    }

    public borrow(): void {
        if (this.isAvailable() === false) {
            // console.log(`Book ${this.title} already borrowed`)
            return
        }
        this.borrowed = true
        this.popularity += 1
        // console.log(`Book ${this.title} borrowed`)
    }

    public return(): void {
        if (this.isAvailable()) {
            // console.log(`Book ${this.title} was not borrowed yet`)
            return
        }
        this.borrowed = false
        // console.log(`Book ${this.title} returned`)
    }

    public isAvailable(): boolean {
        return this.borrowed === false
    }

    public get popularityScore(): number {
        return this.popularity
    }

    public static from<A extends Author = Author>(
        book: Book<A>,
        properties: Partial<Omit<BookProps<A>, "id">> = {}
    ): Book<A> {
        const bookProperties: Omit<BookProps<A>, "id"> = {
            title: properties.title ?? book.title,
            year: properties.year ?? book.year,
            gender: properties.gender ?? book.gender,
            author: properties.author ?? book.author,
            groupId: properties.groupId ?? book.groupId
        }

        return new Book({ ...bookProperties }, bookProperties.groupId)
    }
}
