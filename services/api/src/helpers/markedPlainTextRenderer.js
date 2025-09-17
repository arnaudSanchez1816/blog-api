const block = ({ text }) => `${text}\n\n`
const line = ({ text }) => `${text}\n`
const inline = ({ text }) => text
const newLine = () => "\n"
const empty = () => ""

export const plainTextRenderer = {
    hr: newLine,
    br: newLine,
    checkbox: empty,
    html: empty,
    blockquote: block,
    code: block,
    heading: block,
    paragraph: block,
    list: block,
    space: () => " ",
    table: (token) => line(token.header),
    tablecell: ({ text }) => `${text} `,
    tablerow: line,
    em: inline,
    link: inline,
    image: inline,
    codespan: inline,
    strong: inline,
    text: inline,
}
