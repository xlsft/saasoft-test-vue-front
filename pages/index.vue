<script setup lang="ts">

    import Button from '~/components/inputs/Button.vue';
    import IconQuestion from '~/components/icons/question.vue'
    import { useUsersStore } from '~/stores/users.store.ts';
    import User from '~/components/general/User.vue';

    const users = useUsersStore()

    const container = ref<HTMLDivElement>()
    const content = ref<HTMLDivElement>()
    const height = ref({ container: 0, content: 0 })
    const controller = new AbortController()
    const update = () => {
        if (!container.value || !content.value) return
        height.value = { container: container.value?.clientHeight!, content: content.value?.clientHeight! }
    }; onMounted(() => {
        update()
        window.addEventListener('resize', update, { signal: controller.signal })
    }); onBeforeUnmount(() => {
        controller.abort()
    })

</script>
<template>
    <div class="flex items-center gap-[18px] flex-col w-full h-full p-[24px]" :class="`${height.container - 48 < height.content ? 'justify-start overflow-y-scroll' : 'justify-center'}`" ref="container">
        <div class="flex flex-col gap-[18px] w-[800px]" ref="content">
            <div class="w-full flex items-center justify-between">
                <h1>Учетные записи</h1>
                <Button title="Новая учетная запись" color="theme" @click="() => { users.create(); update() }"/>
            </div>
            <span class="flex gap-[12px] text-xs bg-blue-500/50 border border-blue-500 px-[12px] py-[9px] items-center rounded-lg">
                <IconQuestion class="w-[18px] h-[18px] stroke-white"/>
                <span>Для указания нескольких меток для одной пары логин / пароль, используйте разделитель ";"</span>
            </span>
            <div class="p-[18px] grid grid-cols-10 bg-gray-900 border border-gray-800 rounded-lg gap-[12px]">
                <span class="w-full text-xs opacity-50 mb-[4px] col-span-3">Метки</span>
                <span class="w-full text-xs opacity-50 mb-[4px] col-span-2">Тип записи <span class="text-red-500! mb-[8px]">*</span></span>
                <span class="w-full text-xs opacity-50 mb-[4px] col-span-2">Логин <span class="text-red-500! mb-[8px]">*</span></span>
                <span class="w-full text-xs opacity-50 mb-[4px] col-span-2">Пароль <span class="text-red-500! mb-[8px]">*</span></span>
                <span></span>

                <template v-if="users.list.length > 0" v-for="user in users.list" :key="user.id">
                    <User :user @save="(id) => { users.save(id); update() }" @delete="(id) => { users.delete(id); update() }"/>
                </template>
                <span class="w-full col-span-10 text-xs border-red-500 border rounded-lg bg-red-500/50 px-[12px] h-[38px] flex items-center" v-else>
                    <span>Учетных записей нет</span>
                </span>
            </div>
        </div>
    </div>
</template>