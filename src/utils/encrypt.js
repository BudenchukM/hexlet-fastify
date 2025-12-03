import crypto from 'crypto'

export default (text) => {
  const hash = crypto.createHmac('sha512', 'salt') // можно заменить salt на любой секрет
  hash.update(text)
  return hash.digest('hex')
}
