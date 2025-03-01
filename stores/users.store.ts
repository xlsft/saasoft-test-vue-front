import { defineStore } from 'pinia'
import type { User } from '~/types/user.types'
import { useUUID } from '@ained/composables'

class UsersStoreError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UsersStoreError'
    }
}

export const useUsersStore = defineStore('users', () => {
    const list = ref<Partial<User>[]>([])
    return {
        list,
        create: () => {
            list.value.push({ id: useUUID(), type: 'ldap' })
        },
        delete: (id: User['id']) => {
            const user = list.value.findIndex((user) => user.id === id)
            if (user === -1) throw new UsersStoreError('User not found'); else list.value.splice(user, 1)
        },
        save: (id: User['id']) => {
            const user = list.value.findIndex((user) => user.id === id)
            const data = list.value[user] as User
            if (!data) throw new UsersStoreError('User form not found')
            if (!data.type || !data.login || data.login.length > 100) return
            if (data.type === 'local') { if (!data.password || data.password.length > 100) return } else if (data.type === 'ldap') data.password = null
            if (!data.flags) delete list.value[user].flags
            if (!data.login) delete list.value[user].login; else list.value[user].login = data.login
            if (data.password !== undefined) list.value[user].password = data.password
        },
    }
}, { persist: true })