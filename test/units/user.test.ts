import { Author } from "@/models/author.ts"
import { Book } from "@/models/book.ts"
import { User, UserProps } from "@/models/user.ts"
import { beforeEach, describe, expect, it, vitest } from "vitest"

// Mocking the Book class for testing
vitest.mock("@/models/book.ts", () => ({
  Book: vitest.fn().mockImplementation(() => ({
    isAvailable: vitest.fn().mockReturnValue(true),
    borrow: vitest.fn(),
    return: vitest.fn()
  }))
}))

describe.sequential("User Class", () => {
  let user: User

  it("should create a new instance of User with the provided props", () => {
    const props: Omit<UserProps, "id"> = {
      name: "John Doe",
      birthDate: new Date("1990-01-01"),
      nationality: "US",
      email: "john.doe@example.com",
      gender: "male"
    }

    user = new User(props)

    expect(user.name).toBe(props.name)
    expect(user.birthDate).toBe(props.birthDate)
    expect(user.nationality).toBe(props.nationality)
    expect(user.email).toBe(props.email)
    expect(user.gender).toBe(props.gender)
    expect(user.id).toBeDefined()
  })

  it("should not create a user who was born in the future", () => {
    const now = new Date()
    const future = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1)

    const userProps = {
      ...user,
      birthDate: future
    }

    expect(() => new User(userProps)).toThrow("O usuário não pode ter nascido no futuro")
  })

  describe.sequential("methods", () => {
    let user: User
    let book: Book
    let author: Author

    beforeEach(() => {
      user = new User({
        name: "John Doe",
        email: "john.doe@example.com",
        birthDate: new Date("1990-01-01"),
        nationality: "US",
        gender: "male"
      })

      author = new Author({
        name: "John Doe",
        birthDate: new Date("1990-01-01"),
        nationality: "US",
        gender: "male",
        email: "john.doe@example.com"
      })

      book = new Book({
        author,
        title: "The Great Gatsby",
        year: 1925,
        gender: "Adventure"
      })
    })

    it("should borrow a book successfully", () => {
      const result = user.borrowBook(book)
      expect(result).toBe(true)
      expect(book.borrow).toHaveBeenCalled()
      expect(user.listBorrowedBooks()).toContain(book)
    })

    it("should not borrow an unavailable book", () => {
      // Mocking the book to be unavailable
      book.isAvailable = vitest.fn().mockReturnValue(false)

      const result = user.borrowBook(book)

      expect(result).toBe(false)
      expect(book.borrow).not.toHaveBeenCalled()
      expect(user.listBorrowedBooks()).not.toContain(book)
    })

    it("should return a borrowed book successfully", () => {
      user.borrowBook(book)
      user.returnBook(book)

      expect(book.return).toHaveBeenCalled()
      expect(user.listBorrowedBooks()).not.toContain(book)
    })

    it("should not return an un-borrowed book", () => {
      user.returnBook(book)

      expect(book.return).not.toHaveBeenCalled()
    })
  })
})
