<script setup lang="ts">
    import Text from '~/components/inputs/Text.vue';
    import Select from '~/components/inputs/Select.vue';
    import type { User } from '~/types/user.types';
    import Button from '../inputs/Button.vue';
    import IconDelete from '~/components/icons/delete.vue';

    const props = defineProps<{ user: Partial<User> }>()
    const emits = defineEmits<{ save: [id: User['id']], delete: [id: User['id']] }>()
    const flags = ref()
    const valid = ref<boolean[]>([])
    const focus = ref<boolean[]>([])
    const current = ref<Partial<User>>(props.user || {})
    const update = () => {
        if (!current.value) return
        if (focus.value.filter(v => v).some(v => v)) return
        if (current.value.flags) flags.value = current.value.flags.map(flag => flag.text).join(';')
        valid.value.filter(v => v).every(v => v) && emits('save', current.value.id!)
    }; watch(() => [current.value.flags, current.value.type, current.value.login, current.value.password, flags.value, focus.value], update, { deep: true }); update()
    const split = (value: string, valid: boolean) => {
        if (!valid) return
        if (!value) { current.value.flags = undefined; return }
        const flags: User['flags'] = value.split(';').filter(text => text).map(text => ({ text }))
        current.value.flags = flags
    }

</script>
<template>
    <Text 
        @state="(data) => focus[0] = data.focus"
        class="col-span-3"
        @input="split" 
        v-model="flags"
        v-model:valid="valid[0]"
        :check="(value) => /^(?:[A-Z]+(?:;[A-Z]+)*)?$/gm.test(value)" 
        :max="50"
        placeholder="Метки"
        clear
        invalid-text="Метки - заглавные латинские буквы разделенные <strong>точкой с запятой</strong> длинной от 0 до 50 символов<br>Например: <i>'AAA;BBB;CCC'</i> или <i>'AAA'</i>"
    />
    <Select 
        @state="(data) => focus[1] = (data as any).focus"
        class="col-span-2"
        :options="[
            { label: 'LDAP', value: 'ldap' },
            { label: 'Локальная', value: 'local' }
        ]"
        v-model:valid="valid[1]"
        v-model="current.type"
    />
    <Text
        @state="(data) => focus[2] = data.focus"
        :class="`${current.type === 'local' ? 'col-span-2' : 'col-span-4'}`"
        v-model:valid="valid[2]"
        placeholder="Логин"
        v-model="current.login"
        invalid-empty
        :check="() => true"
        invalid-text="Логин обязателен к заполнению и должен быть от 1 до 100 символов"
        clear
        :max="100"
    />
    <Text
        @state="(data) => focus[3] = data.focus"
        class="col-span-2"
        v-if="current.type === 'local'"
        v-model:valid="valid[3]"
        invalid-empty
        invalid-text="Пароль обязателен к заполнению и должен быть от 1 до 100 символов"
        :check="() => true"
        placeholder="Пароль"
        v-model="current.password"
        clear
        :max="100"
    />
    <Button :icon="IconDelete" class="w-full p-0" @click="emits('delete', props.user.id!)"/>


</template>