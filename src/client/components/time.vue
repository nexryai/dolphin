<template>
<time class="dp-time" :title="absolute">
	<span v-if="mode == 'relative'">{{ relative }}</span>
	<span v-if="mode == 'absolute'">{{ absolute }}</span>
	<span v-if="mode == 'detail'">{{ absolute }} ({{ relative }})</span>
</time>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../i18n';

export default Vue.extend({
	i18n,
	props: {
		time: {
			type: [Date, String],
			required: true
		},
		mode: {
			type: String,
			default: 'relative'
		}
	},
	data() {
		return {
			tickId: null,
			now: new Date()
		};
	},
	computed: {
		_time(): Date {
			return typeof this.time == 'string' ? new Date(this.time) : this.time;
		},
		absolute(): string {
			return this._time.toLocaleString();
		},
		relative(): string {
			const time = this._time;
			const ago = (this.now.getTime() - time.getTime()) / 1000/*ms*/;
			return (
				ago >= 31536000 ? this.$t('_ago.yearsAgo',   { n: (~~(ago / 31536000)).toString() }) :
				ago >= 2592000  ? this.$t('_ago.monthsAgo',  { n: (~~(ago / 2592000)).toString() }) :
				ago >= 604800   ? this.$t('_ago.weeksAgo',   { n: (~~(ago / 604800)).toString() }) :
				ago >= 86400    ? this.$t('_ago.daysAgo',    { n: (~~(ago / 86400)).toString() }) :
				ago >= 3600     ? this.$t('_ago.hoursAgo',   { n: (~~(ago / 3600)).toString() }) :
				ago >= 60       ? this.$t('_ago.minutesAgo', { n: (~~(ago / 60)).toString() }) :
				ago >= 10       ? this.$t('_ago.secondsAgo', { n: (~~(ago % 60)).toString() }) :
				ago >= -1       ? this.$t('_ago.justNow') :
				ago <  -1       ? this.$t('_ago.future') :
				this.$t('@.time.unknown'));
		}
	},
	created() {
		if (this.mode == 'relative' || this.mode == 'detail') {
			this.tickId = window.requestAnimationFrame(this.tick);
		}
	},
	destroyed() {
		if (this.mode === 'relative' || this.mode === 'detail') {
			window.clearTimeout(this.tickId);
		}
	},
	methods: {
		tick() {
			this.now = new Date();

			this.tickId = setTimeout(() => {
				window.requestAnimationFrame(this.tick);
			}, 10000);
		}
	}
});
</script>
