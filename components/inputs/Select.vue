<script setup lang="ts">
    import Text from './Text.vue';
    import IconArrow from '~/components/icons/arrow.vue';
    import IconDelete from '~/components/icons/delete.vue';
    import { Vue3Marquee } from 'vue3-marquee';

    const model = defineModel<any>();
    const valid = defineModel<boolean>('valid');
    const emit = defineEmits<{ 
        'item-click': [option: typeof props.options[number], i: string], 
        'item-dblclick': [option: typeof props.options[number], i: string], 
        'input': [value: typeof model.value],
        'state': [data: typeof state.value]
    }>()

    const props = withDefaults(defineProps<{
        options: Record<string, any>
        title?: any
        placeholder?: any
        required?: boolean
        disabled?: boolean
        invalid?: boolean
        label?: any
        value?: any
        style?: any
        icon?: any
        clear?: boolean
        empty?: any
        hide?: boolean
        check?: (value?: any) => boolean | Promise<boolean>
        checker?: boolean
        interactive?: boolean // ghost prop
    }>(), { label: 'label', value: 'value', empty: 'Нет данных', hide: true })
    
    const state = ref({
        dropdown: false
    })
    const valid_model = ref(valid.value)
    const options = ref(props.options); watch(() => props.options, () => { options.value = props.options; update() }, { deep: true })
    const preview = ref()
    const update = () => {
        preview.value = props.options.find((option: any) => option[props.value] === model.value)?.[props.label]
        emit('input', model.value)
    }
    onMounted(update); watch(model, update, { deep: true })
</script>

<template>
    <Text :style readonly blur :invalid :checker v-model:valid="valid_model" :title placeholder="" :required :disabled :icon :clear input-style="cursor: pointer !important;" @state="(data) => { state = data; emit('state', state) }">
        <template #dropdown>
            <div class="w-full h-full flex flex-col gap-[4px] p-[8px] scrollbar-default" v-if="!$slots.dropdown">
                <button class="group select-tab-button" v-for="option, i in options" :data-selected="model === option[value] && model !== undefined && option[value] !== undefined" @dblclick="async () => { emit('item-dblclick', option, i) }" @click="async () => { emit('item-click', option, i); model = option[value]; props.check ? valid = valid_model = await props.check(option[value]) : null; props.hide ? state.dropdown = false : null }"  v-if="options && options.length > 0">
                    <Vue3Marquee v-if="!$slots.item" animate-on-overflow-only>
                        <span class="w-full text-left overflow-hidden text-ellipsis" >{{ option[label] }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </Vue3Marquee>
                    <slot name="item" v-else :option :i></slot>
                </button>
                <div class="w-full text-center text-[14px] py-[24px] text-white/50" v-else>
                    {{ empty }}
                </div>
                <slot name="bottom"></slot>
            </div>
            <slot name="dropdown" v-else></slot>
        </template>
        <template #input>
            <div class="flex w-[calc(100%-24px)] gap-[8px] absolute top-1/2 translate-y-[-50%] right-[12px] justify-between group/inner">
                <span v-if="model !== undefined && preview" class="font-[400] text-[14px] h-[18px] text-nowrap overflow-hidden text-ellipsis min-h-[18px] flex items-center"  :class="`${invalid ? 'group-hover/input:text-red-500 text-red-500' : 'text-white'}`" >{{ preview }}</span>
                <span class="font-[400] text-[14px] text-nowrap overflow-hidden text-ellipsis h-[18px] min-h-[18px] flex items-center w-full" :class="`${invalid ? 'group-hover/input:text-red-500 text-red-500' : 'group-hover/input:text-blue-500 text-white/50'}`" v-else>{{ placeholder }}</span>
                <div class="flex gap-[8px] items-center" :class="icon ? 'mr-[18px]' : ''">
                    <button class="group/clear pointer-events-auto" @click="async () => { model = props.clear ? undefined : null; props.check ? valid = await props.check(props.clear ? undefined : null) : null; }" v-if="model && clear">
                        <IconDelete class="w-[18px] h-[18px] min-w-[18px] min-h-[18px] transition-all stroke-[1.5px] origin-center duration-500" :class="`${ invalid ? 'stroke-red-500 group-hover/clear:stroke-red-500/30' : 'stroke-white/50 group-hover/clear:stroke-blue-500'}`"/>
                    </button>
                    <IconArrow class="w-[18px] h-[18px] min-w-[18px] min-h-[18px] transition-all stroke-[1.5px] origin-center duration-500" :class="`${ state.dropdown ? 'rotate-[90deg]' : 'rotate-[-90deg]'} ${ invalid ? `stroke-red-500` : `${ state.dropdown ? 'stroke-blue-500' : 'stroke-white/50 group-hover/input:stroke-blue-500'}`} `"/>
                </div>
            </div>
        </template>
    </Text>
</template>


<style>
    @reference "tailwindcss";

    .select-tab-button {
        @apply overflow-hidden text-white text-nowrap w-full h-[32px] min-h-[32px] font-[400] text-[14px]
        stroke-white
        flex items-center text-sm rounded-md gap-[8px] px-[12px] py-[8px] 
        hover:bg-blue-500/20 hover:text-blue-500
        hover:stroke-blue-500 disabled:bg-blue-500/20 
        disabled:text-blue-500 disabled:stroke-blue-500 
        disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all 
        data-[selected=true]:bg-blue-500/20 
        data-[selected=true]:text-blue-500 
        data-[selected=true]:stroke-blue-500
    }
</style>