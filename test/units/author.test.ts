import { Author, AuthorProps } from "@/models/author.ts"
import { describe, expect, it } from "vitest"

describe("Author Class", () => {
  const props: Omit<AuthorProps, "id"> = {
    name: "John Doe",
    birthDate: new Date("1990-01-01"),
    nationality: "USA",
    email: "johndoe@example.com",
    gender: "male"
  }

  it("should create a new Author instance", () => {
    const author = new Author(props)

    expect(author).toBeDefined()
    expect(author.name).toEqual(props.name)
    expect(author.birthDate).toEqual(props.birthDate)
    expect(author.nationality).toEqual(props.nationality)
    expect(author.email).toEqual(props.email)
    expect(author.gender).toEqual(props.gender)
    expect(author.id).toBeDefined()
  })

  it("should not create a author who was born in the future", () => {
    const now = new Date()
    const future = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

    const authorProps = {
      ...props,
      birthDate: future
    }

    expect(() => new Author(authorProps)).toThrow("O autor não pode ter nascido no futuro")
  })
})
