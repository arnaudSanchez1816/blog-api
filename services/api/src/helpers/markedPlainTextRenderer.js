const block = ({ text }) => `${text}\n\n`
const line = ({ text }) => `${text}\n`
const inline = ({ text }) => text
const newLine = () => "\n"
const empty = () => ""

export const plainTextRenderer = {
    hr: newLine,
    br: newLine,
    checkbox: empty,
    html: () => {
        console.log("??")
        return ""
    },
    blockquote: block,
    code: block,
    heading: block,
    paragraph: block,
    space: () => " ",
    table: (token) => line(token.header),
    tablecell: ({ text }) => `${text} `,
    tablerow: line,
    em: (em) => {
        console.log(em)
        return em.text
    },
    link: inline,
    image: inline,
    codespan: inline,
    strong: inline,
    text: inline,
}
