export type User = {
    id: string
    flags?: { text: string }[]
    type: 'ldap' | 'local'
    login: string
    password: string | null
}