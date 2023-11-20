import { Author } from "@/models/author.ts"
import { Book } from "@/models/book.ts"
import { Library } from "@/models/library.ts"
import { User } from "@/models/user.ts"
import { createUUID } from "@/utils/id.ts"
import { beforeEach, describe, expect, expectTypeOf, it, vitest } from "vitest"

class Helper {
  static createAndInsertMultiplesUsers(library: Library, quantity = 10) {
    const users: User[] = []
    for (let i = 0; i < quantity; i++) {
      const user = new User({
        name: `User ${i + 1}`,
        birthDate: new Date("1990-01-01"),
        nationality: "US",
        email: `user${i + 1}@example.com`,
        gender: "male"
      })
      users.push(user)
    }

    Helper.insertMultiplesUsers(users, library)
  }

  static createAndInsertMultiplesBooks(library: Library) {
    const years = [2021, 2022, 2023]
  }

  static insertMultiplesUsers(users: User[], library: Library) {
    users.forEach((user) => {
      library.insertUser(user)
    })
    // console.log(library.listUsers())
  }
}

describe("Library Class", () => {
  let library: Library

  beforeEach(() => {
    library = new Library({
      name: "Library",
      address: "123 Main St",
      phone: "555-1234",
      email: "library@example.com"
    })
  })

  // Mock data
  const USER = new User({
    name: "John Doe",
    birthDate: new Date("1990-01-01"),
    nationality: "US",
    email: "john.doe@example.com",
    gender: "male"
  })

  const AUTHOR = new Author({
    name: "John Doe",
    birthDate: new Date("1990-01-01"),
    nationality: "US",
    email: "john.doe@example.com",
    gender: "male"
  })

  const BOOK = new Book({
    title: "Test Book",
    year: 2021,
    gender: "Adventure",
    author: AUTHOR
  })

  describe("Insert Methods", () => {
    describe("insertUser", () => {
      it("should add a user to the library", () => {
        library.insertUser(USER)

        expect(library.listUsers()).toContain(USER)
      })

      it("should not add a user that already exists in the library", () => {
        library.insertUser(USER)

        expect(() => library.insertUser(USER)).toThrowError("Usuário já existe")
        expect(library.listUsers()).toHaveLength(1)
      })
    })

    describe("insertAuthor", () => {
      it("should add an author to the library", () => {
        library.insertAuthor(AUTHOR)

        expect(library.listAuthors()).toContain(AUTHOR)
      })

      it("should not add an author that already exists in the library", () => {
        library.insertAuthor(AUTHOR)

        expect(() => library.insertAuthor(AUTHOR)).toThrowError("Autor já existe")
        expect(library.listAuthors()).toHaveLength(1)
      })
    })

    describe("insertBook", () => {
      it("should add a book to the library", () => {
        library.insertBook(BOOK)

        expect(library.listBooks()).toContain(BOOK)
      })

      it("should not add a book that already exists in the library", () => {
        library.insertBook(BOOK)

        expect(() => library.insertBook(BOOK)).toThrow("Livro já existe")
        expect(library.listBooks()).toHaveLength(1)
      })
    })

    describe("insertBooksByGroupId", () => {
      it("should add a book to the library based on groupId", () => {
        const groupId = createUUID()
        const books = [BOOK]
        library.listBooksByGroupId = vitest.fn().mockReturnValue(books)
        library.insertBooksByGroupId(groupId)

        expect(library.listBooksByGroupId).toHaveBeenCalledWith(groupId)
        expect(library.listBooks()).toContainEqual(expect.objectContaining({ groupId }))
      })

      it("should throw an error if the group has no books", () => {
        const groupId = createUUID()
        library.listBooksByGroupId = vitest.fn().mockReturnValue([])

        expect(() => library.insertBooksByGroupId(groupId)).toThrowError("Grupo não existe")
      })
    })
  })

  describe("Remove Methods", () => {
    describe("removeBookById", () => {
      it("should remove a book from the library", () => {
        library.insertBook(BOOK)

        expect(library.removeBookById(BOOK.id)).toBe(true)
        expect(library.listBooks()).not.toContain(BOOK)
      })

      it("should throw an error for non-existing book", () => {
        const invalidBookId = createUUID()

        expect(() => library.removeBookById(invalidBookId)).toThrowError("Livro não existe")
      })
    })

    describe("removeUserById", () => {
      it("should remove a user from the library", () => {
        library.insertUser(USER)

        expect(library.removeUserById(USER.id)).toBe(true)
        expect(library.listUsers()).not.toContain(USER)
      })

      it("should throw an error for non-existing user", () => {
        const invalidUserId = createUUID()

        expect(() => library.removeUserById(invalidUserId)).toThrowError("Usuário não existe")
      })

      it("should not remove a user that has borrowed books", () => {
        library.insertUser(USER)
        library.insertBook(BOOK)

        library.borrowBookToUser(USER.id, BOOK.id)

        expect(() => library.removeUserById(USER.id)).toThrowError("Usuário possui livros emprestados")
      })
    })

    describe("removeAuthorById", () => {
      it("should remove an author from the library", () => {
        library.insertAuthor(AUTHOR)

        expect(library.removeAuthorById(AUTHOR.id)).toBe(true)
        expect(library.listAuthors()).not.toContain(AUTHOR)
      })

      it("should throw an error for non-existing author", () => {
        const invalidAuthorId = createUUID()

        expect(() => library.removeAuthorById(invalidAuthorId)).toThrowError("Autor não existe")
      })
    })
  })

  // TODO:
  // Add tests for other listBooksBy... methods based on your specific implementation.
  // For example, listBooksByAuthorId, listBooksByAuthorsName, listBorrowedBooks, etc.
  describe.todo("List Methods", () => {
    const USERS_QUANTITY = 2

    describe("Books", () => {
      it.todo("listBooks should return all books")
      it.todo("listBooksByGroupId should return books by a specific group")
      it.todo("listBooksByAuthorId should return books by a specific author")

      it.todo("listBooksByReleaseYear should return books by a specific release year")
    })

    describe("Users", () => {
      it("listUsers should return all users", () => {
        const users = library.listUsers()
        expectTypeOf(users).toBeArray()
        expect(users).toHaveLength(USERS_QUANTITY)
      })
    })

    describe.todo("Authors", () => {
      it.todo("listAuthors should return all authors")
    })
  })

  describe("Other Methods", () => {
    beforeEach(() => {
      BOOK.return() // Assume the book is available
      library.insertUser(USER)
      library.insertBook(BOOK)
    })

    describe("borrowBookToUser", () => {
      it("should return true if the book is successfully borrowed", () => {
        expect(BOOK.isAvailable()).toBe(true)
        expect(library.borrowBookToUser(USER.id, BOOK.id)).toBe(true)
        expect(BOOK.isAvailable()).toBe(false)
      })

      it("should return false if the book is not available", () => {
        // Assume the book is already borrowed
        BOOK.borrow()

        const result = library.borrowBookToUser(USER.id, BOOK.id)

        expect(result).toBe(false)
      })

      it("should throw a InvalidUserIdError if the user does not exist", () => {
        const invalidUserId = createUUID()

        expect(() => library.borrowBookToUser(invalidUserId, BOOK.id)).toThrow("Usuário não existe")
      })

      it("should throw a InvalidBookIdError if the book does not exist", () => {
        const invalidBookId = createUUID()

        expect(() => library.borrowBookToUser(USER.id, invalidBookId)).toThrow("Livro não existe")
      })

      it("should add the book to the user's borrowed books list", () => {
        BOOK.return() // Assume the book is available
        const otherBook = Book.from(BOOK, BOOK.groupId)

        library.insertBook(otherBook)

        expect(library.borrowBookToUser(USER.id, BOOK.id)).toBe(true)
        expect(library.borrowBookToUser(USER.id, otherBook.id)).toBe(true)
      })

      it("should not add the book to the user's borrowed books list if the book is already borrowed", () => {
        BOOK.borrow() // Assume the book is borrowed
        const otherBook = Book.from(BOOK, BOOK.groupId)
        otherBook.return() // Assume the other book is available

        library.insertBook(otherBook)

        expect(library.borrowBookToUser(USER.id, BOOK.id)).toBe(false)
        expect(library.borrowBookToUser(USER.id, otherBook.id)).toBe(true)
      })
    })

    describe("returnBookFromUser", () => {
      it("should return true if the book is successfully returned", () => {
        expect(library.borrowBookToUser(USER.id, BOOK.id)).toBe(true)
        expect(library.returnBookFromUser(USER.id, BOOK.id)).toBe(true)
      })

      it("should throw an error if the user does not exist", () => {
        const invalidUserId = createUUID()

        expect(() => library.returnBookFromUser(invalidUserId, BOOK.id)).toThrow("Usuário não existe")
      })

      it("should throw an error if the book does not exist", () => {
        const invalidBookId = createUUID()

        expect(() => library.returnBookFromUser(USER.id, invalidBookId)).toThrow("Livro não existe")
      })

      it("should throw an error if the user does not have any books borrowed before returning", () => {
        expect(() => library.returnBookFromUser(USER.id, BOOK.id)).toThrowError("nenhum livro emprestado")
      })

      it("should throw an error if the book is not borrowed by the user", () => {
        const otherUser = new User({
          name: "Jane Doe",
          birthDate: new Date("1990-01-02"),
          nationality: "US",
          email: "jane.doe@example.com",
          gender: "female"
        })

        const otherBook = Book.from(BOOK, BOOK.groupId)

        library.insertUser(otherUser)
        library.insertBook(otherBook)
        library.borrowBookToUser(USER.id, BOOK.id)
        library.borrowBookToUser(otherUser.id, otherBook.id)

        expect(() => library.returnBookFromUser(USER.id, otherBook.id)).toThrowError("não tem este livro emprestado")
        expect(() => library.returnBookFromUser(otherUser.id, BOOK.id)).toThrowError("não tem este livro emprestado")
      })
    })
  })
})
