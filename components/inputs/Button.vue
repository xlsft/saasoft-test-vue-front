<script setup lang="ts">

    import { usePureClick } from '@ained/composables';
    const emit = defineEmits(['click'])
    const container = ref()
    const props = defineProps<{ title?: string, icon?: Component, disabled?: boolean, iconClass?: string, titleClass?: string }>()
    const disable = ref(props.disabled); watch(() => props.disabled, () => disable.value = props.disabled)
    usePureClick(container, () => !disable.value && emit('click'))
</script>
<template>
    <div 
        ref="container"
        :data-button-disabled="disable"
        class="cursor-pointer group flex items-center border border-gray-800 hover:border-blue-500 hover:bg-blue-500/50 bg-gray-900 group gap-[8px] transition-all w-fit justify-center"
    >
        <template v-if="!$slots.content">
            <component v-if="props.icon" :is="props.icon" class="aspect-square stroke-[2px] stroke-white" :class="`min-h-[20px] max-h-[20px] h-[20px] min-w-[20px] max-w-[20px] w-[20px] ${props.iconClass}`"/>        
            <span v-if="props.title" class="leading-tight font-[400] break-keep whitespace-nowrap transition-all w-fit select-none" :class="titleClass">{{ props.title }}</span>
        </template>

        <slot name="content" v-else/>
    </div>
</template>

<style scoped>
    @reference "tailwindcss";
    
    div[data-button-disabled="true"] {
        @apply cursor-not-allowed! opacity-30!
    }
    div[data-button-disabled="true"]:hover {
        @apply cursor-not-allowed! opacity-30!
    }

    div {
        @apply transition-all! *:transition-all!
    }
    div {
        @apply h-[38px]! px-[12px]! rounded-lg! text-xs!
    }
</style>