import {
    BaseLibrary,
    BaseLibraryAuthorsInsertMethods,
    BaseLibraryAuthorsListMethods,
    BaseLibraryAuthorsRemoveMethods,
    BaseLibraryBooksInsertMethods,
    BaseLibraryBooksListMethods,
    BaseLibraryBooksRemoveMethods,
    BaseLibraryInfoProps,
    BaseLibraryProps,
    BaseLibraryUsersInsertMethods,
    BaseLibraryUsersListMethods,
    BaseLibraryUsersRemoveMethods
} from "@/bases/library.ts"
import { Author } from "@/models/author.ts"
import { Book } from "@/models/book.ts"
import { User } from "@/models/user.ts"

export interface LibraryProps extends BaseLibraryProps {}

export interface LibraryUsersInsertMethods<U extends User> extends BaseLibraryUsersInsertMethods<U> {}
export interface LibraryUsersRemoveMethods<U extends User> extends BaseLibraryUsersRemoveMethods<U> {}
export interface LibraryUsersListMethods<U extends User> extends BaseLibraryUsersListMethods<U> {}

export interface LibraryAuthorsInsertMethods<A extends Author> extends BaseLibraryAuthorsInsertMethods<A> {}
export interface LibraryAuthorsRemoveMethods<A extends Author> extends BaseLibraryAuthorsRemoveMethods<A> {}
export interface LibraryAuthorsListMethods<A extends Author> extends BaseLibraryAuthorsListMethods<A> {}

export interface LibraryBooksInsertMethods<B extends Book> extends BaseLibraryBooksInsertMethods<B> {
    insertBooksByGroupId(groupId: B["groupId"], quantity?: number): void
}
export interface LibraryBooksRemoveMethods<B extends Book> extends BaseLibraryBooksRemoveMethods<B> {}
export interface LibraryBooksListMethods<B extends Book> extends BaseLibraryBooksListMethods<B> {
    listBooksByGroupId(groupId: B["groupId"]): B[]
}

export interface LibraryUsersMethods<U extends User>
    extends LibraryUsersInsertMethods<U>,
        LibraryUsersRemoveMethods<U>,
        LibraryUsersListMethods<U> {}

export interface LibraryAuthorsMethods<A extends Author>
    extends LibraryAuthorsInsertMethods<A>,
        LibraryAuthorsRemoveMethods<A>,
        LibraryAuthorsListMethods<A> {}

export interface LibraryBooksMethods<B extends Book>
    extends LibraryBooksInsertMethods<B>,
        LibraryBooksRemoveMethods<B>,
        LibraryBooksListMethods<B> {}

export interface LibraryMethods<U extends User, A extends Author, B extends Book<A>>
    extends LibraryUsersMethods<U>,
        LibraryAuthorsMethods<A>,
        LibraryBooksMethods<B> {
    borrowBookToUser(userId: U["id"], bookId: B["id"]): boolean
    returnBookFromUser(userId: U["id"], bookId: B["id"]): boolean
}

export class Library<U extends User = User, A extends Author = Author, B extends Book<A> = Book<A>>
    extends BaseLibrary<U, A, B>
    implements LibraryProps, LibraryMethods<U, A, B>
{
    protected override books: Map<B["id"], B>
    protected override users: Map<U["id"], U>
    protected override authors: Map<A["id"], A>

    private borrowedBooksByUserMap: Map<U["id"], Set<B["id"]>> = new Map()

    constructor(info: Omit<BaseLibraryInfoProps, "id">) {
        const { name, address, phone, email } = info
        super({ name, address, phone, email })

        this.books = new Map<B["id"], B>()
        this.users = new Map<U["id"], U>()
        this.authors = new Map<A["id"], A>()
    }

    public insertBook(book: B): void {
        if (this.validateBookId(book.id) === true) throw new Error("Livro já existe")
        this.books.set(book.id, book)
    }

    public insertBooksByGroupId(groupId: B["groupId"], quantity: number = 1): void {
        const books = this.listBooksByGroupId(groupId)

        if (books.length === 0) throw new Error("Grupo não existe")

        for (let i = 0; i < quantity; i++) {
            const book = Book.from(books[0]!, { groupId })
            this.books.set(book.id, book as B)
        }
    }

    public insertUser(user: U): void {
        if (this.validateUserId(user.id) === true) throw new Error("Usuário já existe")
        this.users.set(user.id, user)
    }

    public insertAuthor(author: A): void {
        if (this.validateAuthorId(author.id) === true) throw new Error("Autor já existe")
        this.authors.set(author.id, author)
    }

    public listBooks(): B[] {
        return Array.from(this.books.values())
    }

    public listUsers(): U[] {
        return Array.from(this.users.values())
    }

    public listAuthors(): A[] {
        return Array.from(this.authors.values())
    }

    public removeBookById(bookId: B["id"]): boolean {
        if (this.validateBookId(bookId) === false) throw new Error("Livro não existe")
        if (this.books.get(bookId)?.isAvailable() === false) throw new Error("Livro emprestado, não pode ser removido")
        return this.books.delete(bookId)
    }
    public removeUserById(userId: U["id"]): boolean {
        if (this.validateUserId(userId) === false) throw new Error("Usuário não existe")
        if (this.borrowedBooksByUserMap.has(userId) && this.borrowedBooksByUserMap.get(userId)!.size !== 0)
            throw new Error("Usuário possui livros emprestados")

        return this.users.delete(userId)
    }

    public removeAuthorById(authorId: A["id"]): boolean {
        if (this.validateAuthorId(authorId) === false) throw new Error("Autor não existe")
        return this.authors.delete(authorId)
    }

    public listBooksByGroupId(groupId: B["groupId"]): B[] {
        const predicate = (book: B) => book.groupId === groupId
        return this.listBooksByPredicate(predicate)
    }

    public listBooksByAuthorId(authorId: B["author"]["id"]): B[] {
        if (this.validateAuthorId(authorId) === false) throw new Error("Autor inexistente")
        const predicate = (book: B) => book.author.id === authorId
        return this.listBooksByPredicate(predicate)
    }

    public listBooksByAuthorsName(name: string): B[] {
        const predicate = (book: B) => book.author.name === name
        return this.listBooksByPredicate(predicate)
    }

    public listBorrowedBooks(): B[] {
        const predicate = (book: B) => book.isAvailable() === false
        return this.listBooksByPredicate(predicate)
    }

    public listAvailableBooks(): B[] {
        const predicate = (book: B) => book.isAvailable()
        return this.listBooksByPredicate(predicate)
    }

    public listBooksByGender(gender: B["gender"]): B[] {
        const predicate = (book: B) => book.gender === gender
        return this.listBooksByPredicate(predicate)
    }

    public listBooksByReleaseYear(year: number): B[] {
        const predicate = (book: B) => book.year === year
        return this.listBooksByPredicate(predicate)
    }

    public returnBookFromUser(userId: U["id"], bookId: B["id"]): boolean {
        if (this.validateUserId(userId) === false) throw new Error("Usuário não existe")
        if (this.validateBookId(bookId) === false) throw new Error("Livro não existe")

        if (this.borrowedBooksByUserMap.has(userId) === false)
            throw new Error("Usuário não tem nenhum livro emprestado")
        if (this.borrowedBooksByUserMap.get(userId)?.has(bookId) === false)
            throw new Error("Usuário não tem este livro emprestado")

        return this.borrowedBooksByUserMap.get(userId)!.delete(bookId)
    }

    public borrowBookToUser(userId: U["id"], bookId: B["id"]): boolean {
        if (this.validateUserId(userId) === false) throw new Error("Usuário não existe")
        if (this.validateBookId(bookId) === false) throw new Error("Livro não existe")

        const user = this.users.get(userId)!
        const book = this.books.get(bookId)!

        if (book.isAvailable() === false) return false

        if (this.borrowedBooksByUserMap.has(userId)) this.borrowedBooksByUserMap.get(userId)?.add(bookId)
        else this.borrowedBooksByUserMap.set(userId, new Set([bookId]))

        return user.borrowBook(book)
    }

    protected listBooksByPredicate(predicate: (entity: B) => boolean): B[] {
        const books: B[] = []

        this.books.forEach((book) => {
            if (predicate(book)) {
                books.push(book)
            }
        })

        return books
    }

    protected listAuthorsByPredicate(predicate: (entity: A) => boolean): A[] {
        const authors: A[] = []

        this.authors.forEach((author) => {
            if (predicate(author)) {
                authors.push(author)
            }
        })

        return authors
    }

    protected listUsersByPredicate(predicate: (entity: U) => boolean): U[] {
        const users: U[] = []

        this.users.forEach((user) => {
            if (predicate(user)) {
                users.push(user)
            }
        })

        return users
    }

    private validateUserId(userId: U["id"]): boolean {
        return this.users.has(userId)
    }

    private validateAuthorId(authorId: A["id"]): boolean {
        return this.authors.has(authorId)
    }

    private validateBookId(bookId: B["id"]): boolean {
        return this.books.has(bookId)
    }
}
