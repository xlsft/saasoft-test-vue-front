export type User = {
    flags?: { text: string }[]
    type: 'ldap' | 'local'
    login: string
    password: string | null
}