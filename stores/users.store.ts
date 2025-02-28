import { defineStore } from 'pinia'
import type { User } from '~/types/user.types'

class UserError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserError'
    }
}

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([])
    return {
        set: (user: User) => {
            users.value.push(user); return user
        },
        get: (index: number): User => {
            if (!users.value[index]) throw new UserError(`User with ${index} index not found`)
            return users.value[index]
        },
        update(index: number, user: Partial<User>): User {
            if (!users.value[index]) throw new UserError(`User with ${index} index not found`)
            return users.value[index] = { ...users.value[index], ...user }
        }
    }
})