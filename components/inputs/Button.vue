<script setup lang="ts">

    import { useBadge, usePureClick } from '@ained/composables';
    const emit = defineEmits(['click'])
    const container = ref()
    const props = withDefaults(defineProps<{ title?: string, icon?: Component, color?: 'accent' | 'theme' | 'text' | 'red' | 'transparent' | 'static' | 'highlighted', disabled?: boolean, small?: boolean, iconClass?: string, titleClass?: string }>(), { color: 'accent' })
    const disable = ref(props.disabled); watch(() => props.disabled, () => disable.value = props.disabled)
    const colors = {
        accent: () => useBadge('6366f1'),
        highlighted: () => useBadge('ffffff'),
        theme: () => useBadge('ffffff'),
        text: () => useBadge('1f2937'),
        red: () => useBadge('ef4444'),
        transparent: () => { return {
            color: ';',
            stroke: ';',
            background: 'transparent',
            borderColor: 'transparent'
        }},
        static: () => { return {
            color: ';',
            stroke: ';',
            background: 'transparent',
            borderColor: 'transparent'
        }}
    }
    const style = ref(colors[props.color as keyof typeof colors]())
    watch(() => props.color, () => style.value = colors[props.color as keyof typeof colors]())
    usePureClick(container, () => !disable.value && emit('click'))
</script>
<template>
    <div 
        ref="container"
        :data-button-disabled="disable"
        :style="props.color === 'theme' ? { ...style, background: undefined } : style"
        class="cursor-pointer group flex items-center border group gap-[8px] transition-all"
        :data-button-color="color"
        :data-button-size="small ? 'small' : 'normal'"
    >
        <template v-if="!$slots.content">
            <component v-if="props.icon" :is="props.icon" class="aspect-square stroke-[2px]" :style="`${ props.color === 'theme' ? '' : `stroke: ${style.color}`}`" :class="`${ props.color === 'theme' ? 'group-hover:stroke-indigo-500' : '' } ${ props.color === 'highlighted' ? 'stroke-indigo-500' : '' } ${ props.small ? 'min-h-[16px] max-h-[16px] h-[16px] min-w-[16px] max-w-[16px] w-[16px]' : 'min-h-[20px] max-h-[20px] h-[20px] min-w-[20px] max-w-[20px] w-[20px]'} ${props.iconClass}`"/>        
            <span v-if="props.title" class="leading-tight font-[400] break-keep whitespace-nowrap transition-all w-fit select-none" :class="titleClass">{{ props.title }}</span>
        </template>

        <slot name="content" v-else :style/>
    </div>
</template>

<style scoped>

    div[data-button-disabled="true"] {
        @apply cursor-not-allowed opacity-30 !important
    }
    div[data-button-disabled="true"]:hover {
        @apply cursor-not-allowed opacity-30 !important
    }

    div {
        @apply transition-all *:transition-all
    }
    div[data-button-size="normal"] {
        @apply h-[38px] px-[12px] rounded-lg text-sm
    }
    div[data-button-size="small"] {
        @apply h-[32px] px-[8px] font-medium rounded-lg text-xs
    }
    div[data-button-color="theme"]:not([data-button-disabled="true"]) {
        @apply border bg-white stroke-gray-500 text-gray-500 !important
    }
    div:hover[data-button-color="theme"]:not([data-button-disabled="true"]) {
        @apply border-indigo-500 text-indigo-500 stroke-indigo-500 !important
    }
    div[data-button-color="highlighted"]:not([data-button-disabled="true"]) {
        @apply bg-white border-indigo-500 text-indigo-500 stroke-indigo-500 !important
    }
    div:hover[data-button-color="text"]:not([data-button-disabled="true"]), 
    div:hover[data-button-color="accent"]:not([data-button-disabled="true"]), 
    div:hover[data-button-color="red"]:not([data-button-disabled="true"]) {
        @apply opacity-80 !important
    }
    div[data-button-color="transparent"]:not([data-button-disabled="true"]) {
        @apply stroke-gray-500 text-gray-500 transition-all  !important
    }
    div:hover[data-button-color="transparent"]:not([data-button-disabled="true"]) {
        @apply text-indigo-500 stroke-indigo-500 transition-all  !important
    }

    div[data-button-color="transparent"]:not([data-button-disabled="true"]) {
        @apply stroke-gray-800 text-gray-800 transition-all  !important
    }
    div:hover[data-button-color="transparent"]:not([data-button-disabled="true"]) {
        @apply text-gray-500 stroke-gray-500 transition-all  !important
    }



</style>