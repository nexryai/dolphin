<template>
<button class="nrvgflfuaxwgkxoynpnumyookecqrrvh _button" @click="toggle">
	<b>{{ value ? this.$t('_cw.hide') : this.$t('_cw.show') }}</b>
	<span v-if="!value">{{ this.label }}</span>
</button>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../i18n';
import { length } from 'stringz';
import { concat } from '../../prelude/array';

export default Vue.extend({
	i18n,

	props: {
		value: {
			type: Boolean,
			required: true
		},
		note: {
			type: Object,
			required: true
		}
	},

	computed: {
		label(): string {
			return concat([
				this.note.text ? [this.$t('_cw.chars', { count: length(this.note.text) })] : [],
				this.note.files && this.note.files.length !== 0 ? [this.$t('_cw.files', { count: this.note.files.length }) ] : [],
				this.note.poll != null ? [this.$t('_cw.poll')] : []
			] as string[][]).join(' / ');
		}
	},

	methods: {
		length,

		toggle() {
			this.$emit('input', !this.value);
		}
	}
});
</script>

<style lang="scss" scoped>
.nrvgflfuaxwgkxoynpnumyookecqrrvh {
	display: inline-block;
	padding: 4px 8px;
	font-size: 0.7em;
	color: #fff;
	background: #b1b9c1;
	border-radius: 2px;

	@media (prefers-color-scheme: dark) {
		color: #393f4f;
		background: #687390;
	}

	&:hover {
		background: #bbc4ce;

		@media (prefers-color-scheme: dark) {
			background: #707b97;
		}
	}

	> span {
		margin-left: 4px;

		&:before {
			content: '(';
		}

		&:after {
			content: ')';
		}
	}
}
</style>
