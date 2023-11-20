import { BaseAuthor } from "@/bases/author.ts"
import { BaseBook } from "@/bases/book.ts"
import { BaseUser } from "@/bases/user.ts"
import { UUID, createUUID } from "@/utils/id.ts"

export interface BaseLibraryInfoProps {
    name: string
    address: string
    phone: string
    email: string
}

export interface BaseLibraryProps {
    id: UUID
    info: BaseLibraryInfoProps
}

export interface BaseLibraryUsersInsertMethods<U extends BaseUser> {
    insertUser(user: U): void
}

export interface BaseLibraryUsersRemoveMethods<U extends BaseUser> {
    removeUserById(userId: U["id"]): boolean
}

export interface BaseLibraryUsersListMethods<U extends BaseUser> {
    listUsers(): U[]
}

export interface BaseLibraryAuthorsInsertMethods<A extends BaseAuthor> {
    insertAuthor(author: A): void
}

export interface BaseLibraryAuthorsRemoveMethods<A extends BaseAuthor> {
    removeAuthorById(authorId: A["id"]): boolean
}

export interface BaseLibraryAuthorsListMethods<A extends BaseAuthor> {
    listAuthors(): A[]
}

export interface BaseLibraryBooksInsertMethods<B extends BaseBook> {
    insertBook(book: B): void
}

export interface BaseLibraryBooksRemoveMethods<B extends BaseBook> {
    removeBookById(bookId: B["id"]): boolean
}

export interface BaseLibraryBooksListMethods<B extends BaseBook> {
    listBooks(): B[]
    listBorrowedBooks(): B[]
    listAvailableBooks(): B[]
    listBooksByGender(gender: B["gender"]): B[]
    listBooksByReleaseYear(year: B["year"]): B[]
    listBooksByAuthorId(authorId: B["author"]["id"]): B[]
    listBooksByAuthorsName(name: B["author"]["name"]): B[]
}

export abstract class BaseLibrary<U extends BaseUser, A extends BaseAuthor, B extends BaseBook<A>>
    implements
        BaseLibraryProps,
        BaseLibraryUsersInsertMethods<U>,
        BaseLibraryUsersRemoveMethods<U>,
        BaseLibraryUsersListMethods<U>,
        BaseLibraryAuthorsInsertMethods<A>,
        BaseLibraryAuthorsRemoveMethods<A>,
        BaseLibraryAuthorsListMethods<A>,
        BaseLibraryBooksInsertMethods<B>,
        BaseLibraryBooksRemoveMethods<B>,
        BaseLibraryBooksListMethods<B>
{
    public readonly id: UUID
    public readonly info: BaseLibraryInfoProps
    protected users: Map<string, U>
    protected authors: Map<string, A>
    protected books: Map<string, B>

    constructor(info: Omit<BaseLibraryInfoProps, "id">) {
        this.info = info

        this.users = new Map<string, U>()
        this.authors = new Map<string, A>()
        this.books = new Map<string, B>()

        this.id = createUUID()
    }

    public abstract insertUser(user: U): void
    public abstract insertAuthor(author: A): void
    public abstract insertBook(book: B): void

    public abstract removeUserById(id: U["id"]): boolean
    public abstract removeAuthorById(id: A["id"]): boolean
    public abstract removeBookById(id: B["id"]): boolean

    public abstract listUsers(): U[]
    public abstract listAuthors(): A[]
    public abstract listBooks(): B[]

    public abstract listBorrowedBooks(): B[]
    public abstract listAvailableBooks(): B[]
    public abstract listBooksByGender(gender: B["gender"]): B[]
    public abstract listBooksByReleaseYear(year: B["year"]): B[]
    public abstract listBooksByAuthorId(authorId: B["author"]["id"]): B[]
    public abstract listBooksByAuthorsName(name: B["author"]["name"]): B[]
}
