import { BaseAuthor, BaseAuthorProps } from "@/bases/author.ts"

export interface AuthorProps extends BaseAuthorProps {}

export class Author extends BaseAuthor implements AuthorProps {
    constructor(author: Omit<BaseAuthorProps, "id">) {
        super(author)
    }
}
