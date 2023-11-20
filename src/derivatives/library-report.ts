import { BaseBookGenderType } from "@/bases/book.ts"
import { BasePersonGenderType } from "@/bases/person.ts"
import { BaseReportInterface, Report } from "@/bases/report.ts"
import { Author } from "@/models/author.ts"
import { Book } from "@/models/book.ts"
import { Library } from "@/models/library.ts"
import { User } from "@/models/user.ts"
import { stringify } from "@/utils/json.ts"

type ReportReturnType = ReturnType<typeof stringify>

interface BooksReportInterface extends BaseReportInterface {
    generateBorrowedBooksReport(): void
    generateAvailableBooksReport(): void
    generateBooksByYearReport(): void
    generateBooksByGenderReport(): void
    generateBooksPopularityReport(limit?: number): void
}

interface UsersReportInterface extends BaseReportInterface {
    generateUsersByNumberOfBorrowedBooksReport(): ReportReturnType
    generateUsersByAgeReport(): ReportReturnType
    generateUsersByGenderReport(): ReportReturnType
    generateUsersQuantitiesByNationalityReport(): ReportReturnType
}

interface AuthorsReportInterface extends BaseReportInterface {
    generateAuthorsByNumberOfBooksReport(): void
    generatePopularAuthorsReport(limit?: number): void
    generateMostPopularAuthorsBookReport(): void
    generateAuthorsQuantitiesByNationalityReport(): void
    generateAuthorsListByNationalityReport(): void
}

interface LibraryReportInterface extends BooksReportInterface, AuthorsReportInterface, UsersReportInterface {}

export class LibraryReport extends Report implements LibraryReportInterface {
    protected readonly library: Library

    constructor(library: Library) {
        super()
        this.library = library
    }

    //// BOOKS REPORTS ////

    public generateBorrowedBooksReport(): void {
        const borrowedBooks: Book[] = this.library.listBorrowedBooks()
        console.log("Borrowed Books Report:")
        LibraryReport.printBookList(borrowedBooks)
    }

    public generateAvailableBooksReport(): void {
        const availableBooks: Book[] = this.library.listAvailableBooks()
        console.log("Available Books Report:")
        LibraryReport.printBookList(availableBooks)
    }

    public generateBooksByYearReport(): void {
        console.log("Books by Year Report:")
        const books: Book[] = this.library.listBooks()
        const booksByYearMap = new Map<number, number>()

        if (books.length === 0) {
            console.log("No books found.")
            return
        }

        books.forEach((book) => {
            if (booksByYearMap.has(book.year)) {
                booksByYearMap.set(book.year, booksByYearMap.get(book.year)! + 1)
            } else {
                booksByYearMap.set(book.year, 1)
            }
        })

        booksByYearMap.forEach((quantity, year) => {
            console.log(`Year: ${year}, Quantity: ${quantity}`)
        })
    }

    public generateBooksByGenderReport(): void {
        console.log("Books by Gender Report:")
        const books: Book[] = this.library.listBooks()
        const booksByGenderMap = new Map<BaseBookGenderType, number>()

        if (books.length === 0) {
            console.log("No books found.")
            return
        }

        books.forEach((book) => {
            if (booksByGenderMap.has(book.gender)) {
                booksByGenderMap.set(book.gender, booksByGenderMap.get(book.gender)! + 1)
            } else {
                booksByGenderMap.set(book.gender, 1)
            }
        })

        booksByGenderMap.forEach((gender, quantity) => {
            console.log(`Gender: ${gender}, Quantity: ${quantity}`)
        })
    }

    public generateBooksPopularityReport(limit?: number): void {
        const books: Book[] = this.library.listBooks()

        if (limit === undefined || limit > books.length || limit < 1) {
            limit = books.length
        }

        console.log(`Top ${limit} most popular Books Report:`)

        if (books.length === 0) {
            console.log("No books found.")
            return
        }

        books.forEach((book) => {
            console.log(`Title: ${book.title}, Popularity: ${book.popularityScore}`)
        })
    }

    //// AUTHORS REPORTS ////

    public generateAuthorsByNumberOfBooksReport(): void {
        console.log("Authors by Number of Books Report:")
        const authors: Author[] = this.library.listAuthors()

        if (authors.length === 0) {
            console.log("No authors found.")
            return
        }

        authors.forEach((author) => {
            const numberOfBooks = this.library.listBooksByAuthorsName(author.name).length
            console.log(`Author: ${author.name}, Number of Books: ${numberOfBooks}`)
        })
    }

    public generatePopularAuthorsReport(limit?: number): void {
        const books: Book[] = this.library.listBooks()
        const popularAuthorsMap = new Map<Author, number>()

        books.forEach((book) => {
            if (popularAuthorsMap.has(book.author)) {
                popularAuthorsMap.set(book.author, popularAuthorsMap.get(book.author)! + book.popularityScore)
            } else {
                popularAuthorsMap.set(book.author, book.popularityScore)
            }
        })

        if (limit === undefined || limit < 1 || limit > popularAuthorsMap.size) {
            limit = popularAuthorsMap.size
        }

        console.log(`Top ${limit} popular Authors:`)
        if (books.length === 0) {
            console.log("No authors found.")
            return
        }

        Array.from(popularAuthorsMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .forEach(([author, count]) => {
                console.log(`Author: ${author.name}, Number of books read: ${count}`)
            })
    }

    public generateMostPopularAuthorsBookReport(): void {
        console.log("Most popular Author's Book Report:")
        const books: Book[] = this.library.listBooks()
        const mostPopularAuthorsBookMap = new Map<Author, Book>()

        if (books.length === 0) {
            console.log("No books found.")
            return
        }

        for (const book of books) {
            const author = book.author

            if (mostPopularAuthorsBookMap.has(author)) {
                const existingBook = mostPopularAuthorsBookMap.get(author)
                if (book.popularityScore > existingBook!.popularityScore) {
                    mostPopularAuthorsBookMap.set(author, book)
                }
            } else {
                mostPopularAuthorsBookMap.set(author, book)
            }
        }

        mostPopularAuthorsBookMap.forEach((book, author) => {
            console.log(`Author: ${author.name}, Title: ${book.title}, Popularity: ${book.popularityScore}`)
        })
    }

    public generateAuthorsQuantitiesByNationalityReport(): void {
        console.log("Number of Authors by Nationality Report:")
        const authors: Author[] = this.library.listAuthors()
        const authorsByNationalityMap = new Map<string, number>()

        if (authors.length === 0) {
            console.log("No authors found.")
            return
        }

        authors.forEach((author) => {
            if (authorsByNationalityMap.has(author.nationality)) {
                authorsByNationalityMap.set(author.nationality, authorsByNationalityMap.get(author.nationality)! + 1)
            } else {
                authorsByNationalityMap.set(author.nationality, 1)
            }
        })

        authorsByNationalityMap.forEach((quantity, nationality) => {
            console.log(`Nationality: ${nationality}, Quantity: ${quantity}`)
        })
    }

    public generateAuthorsListByNationalityReport(): void {
        console.log("Authors List by Nationality Report:")
        const authors: Author[] = this.library.listAuthors()
        const authorsByNationalityMap = new Map<string, Author[]>()

        if (authors.length === 0) {
            console.log("No authors found.")
            return
        }

        authors.forEach((author) => {
            if (authorsByNationalityMap.has(author.nationality)) {
                authorsByNationalityMap.get(author.nationality)!.push(author)
            } else {
                authorsByNationalityMap.set(author.nationality, [author])
            }
        })

        authorsByNationalityMap.forEach((authors, nationality) => {
            console.log(`Nationality: ${nationality}`)
            authors.forEach((author) => {
                console.log(`Author: ${author.name}`)
            })
        })
    }

    //// USERS REPORTS ////
    generateUsersByNumberOfBorrowedBooksReport(): ReportReturnType {
        const report = {
            name: "Users by Number of Borrowed Books Report",
            data: [] as unknown[]
        }
        const users: User[] = this.library.listUsers()
        console.log("Users by Number of Borrowed Books Report:")

        if (users.length === 0) {
            console.log("No users found.")
            return stringify(report)
        }

        users.forEach((user) => {
            const userBorrowedBooksQuantity: number = user.listBorrowedBooks().length
            report.data.push(`User: ${user.name}, Number of borrowed books: ${userBorrowedBooksQuantity}`)
        })

        return stringify(report)
    }

    generateUsersByAgeReport(): ReportReturnType {
        const users: User[] = this.library.listUsers()
        const usersByAgeMap = new Map<number, number>()

        if (users.length === 0) {
            console.log("No users found.")
            return stringify(repos)
        }

        users.forEach((user) => {
            const age = LibraryReport.calculateAgeFromBirthDate(user.birthDate)
            if (usersByAgeMap.has(age)) {
                usersByAgeMap.set(age, usersByAgeMap.get(age)! + 1)
            } else {
                usersByAgeMap.set(age, 1)
            }
        })
    }

    generateUsersByGenderReport(): ReportReturnType {
        const users: User[] = this.library.listUsers()
        const usersByGender = new Map<BasePersonGenderType, number>()

        if (users.length === 0) {
            console.log("No users found.")
            return
        }

        users.forEach((user) => {
            const gender = user.gender
            if (usersByGender.has(gender)) {
                usersByGender.set(gender, usersByGender.get(gender)! + 1)
            } else {
                usersByGender.set(gender, 1)
            }
        })

        usersByGender.forEach((quantity, gender) => {
            console.log(`Gender: ${gender}, Quantity: ${quantity}`)
        })
    }

    generateUsersQuantitiesByNationalityReport(): ReportReturnType {
        const users: User[] = this.library.listUsers()
        const usersByNationality = new Map<string, number>()

        if (users.length === 0) {
            console.log("No users found.")
            return
        }

        users.forEach((user) => {
            const nationality = user.nationality
            if (usersByNationality.has(nationality)) {
                usersByNationality.set(nationality, usersByNationality.get(nationality)! + 1)
            } else {
                usersByNationality.set(nationality, 1)
            }
        })

        usersByNationality.forEach((quantity, nationality) => {
            console.log(`Nationality: ${nationality}, Quantity: ${quantity}`)
        })
    }

    //// PRIVATE UTILS ////

    private static printBookList(books: Book[]): void {
        if (books.length === 0) {
            console.log("No books found.")
            return
        }

        books.forEach((book) => {
            console.log(`Title: ${book.title}, Author: ${book.author}, Gender: ${book.gender}, Year: ${book.year}`)
        })
    }

    private static calculateAgeFromBirthDate(birthDate: Date, today?: Date): number {
        today = today ?? new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()

        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1
        } else {
            return age
        }
    }
}
