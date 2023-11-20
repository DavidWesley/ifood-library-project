import { LibraryReport } from "@/derivatives/library-report.ts"
import { Library } from "@/models/library.ts"

function main(): void {
    const library = new Library({ address: "", email: "", name: "", phone: "" })
    const libraryReport = new LibraryReport(library)
}

main()
