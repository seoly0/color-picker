const load = async (src) => {
  const res = await fetch(src)
  const data = await res.text()

  console.log(data)

  const parser = new DOMParser()
  return parser.parseFromString(data, "text/html")
}