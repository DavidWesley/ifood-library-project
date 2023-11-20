import { BaseUser, BaseUserProps } from "@/bases/user.ts"
import { Book } from "@/models/book.ts"

export interface UserProps extends BaseUserProps {}

export class User extends BaseUser implements UserProps {
    private borrowedBooks: Book[] = []

    constructor(user: Omit<BaseUserProps, "id">) {
        super(user)
    }

    public borrowBook(book: Book): boolean {
        if (book.isAvailable() === false) {
            return false
        }

        book.borrow()
        this.borrowedBooks.push(book)
        return true
    }

    public returnBook(book: Book) {
        const borrowedBookIndex = this.borrowedBooks.findIndex((borrowedBook) => borrowedBook === book)
        if (borrowedBookIndex === -1) return

        const borrowedBook = this.borrowedBooks[borrowedBookIndex]
        this.borrowedBooks.splice(borrowedBookIndex, 1)

        borrowedBook!.return()
    }

    public listBorrowedBooks(): Book[] {
        return Array.from(this.borrowedBooks)
    }
}
