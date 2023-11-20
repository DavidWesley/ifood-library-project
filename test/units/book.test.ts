import { BaseBookProps } from "@/bases/book.ts"
import { Author, AuthorProps } from "@/models/author.ts"
import { Book } from "@/models/book.ts"
import { beforeEach, describe, expect, it } from "vitest"

describe("Book Class", () => {
  let book: Book<Author>

  beforeEach(() => {
    const author = new Author({
      name: "John Doe",
      birthDate: new Date("1990-01-01"),
      nationality: "American",
      gender: "male",
      email: "john.doe@example.com"
    })

    const baseBookProps: Omit<BaseBookProps<AuthorProps>, "id"> = {
      title: "Test Book",
      year: author.birthDate.getUTCFullYear() + 1,
      gender: "Adventure",
      author
    }

    book = new Book(baseBookProps)
  })

  it("should create a new book", () => {
    expect(book).toBeDefined()
  })

  it("should copy the book", () => {
    const otherBook = Book.from(book)

    expect(otherBook).toBeDefined()
    expect(otherBook).not.toBe(book)
    expect(otherBook.id).not.toEqual(book.id)
    expect({ ...otherBook, id: book.id }).toStrictEqual({ ...book })
  })

  it("should throw an error when author birth date is after the book release date", () => {
    expect(() =>
      Book.from(book, {
        year: book.author.birthDate.getUTCFullYear() - 1
      })
    ).toThrowError("livro não pode ser publicado antes do nascimento do autor")
  })

  it("should throw an error if the book release date is in the future", () => {
    expect(() =>
      Book.from(book, {
        year: new Date().getUTCFullYear() + 1
      })
    ).toThrowError("livro não pode ser publicado no futuro")
  })

  it("should borrow the book when not already borrowed", () => {
    book.borrow()
    expect(book.isAvailable()).toBe(false)
    expect(book.popularityScore).toBe(1)
  })

  it("should not borrow the book when already borrowed", () => {
    book.borrow()
    book.borrow()
    expect(book.isAvailable()).toBe(false)
    expect(book.popularityScore).toBe(1)
  })

  it("should return the book when already borrowed", () => {
    book.borrow()
    book.return()
    expect(book.isAvailable()).toBe(true)
  })

  it("should not return the book when not already borrowed", () => {
    expect(book.isAvailable()).toBe(true)
    book.return()
    expect(book.isAvailable()).toBe(true)
  })
})
