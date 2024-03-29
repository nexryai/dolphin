<template>
<div class="zmdxowus">
	<p class="caution" v-if="choices.length < 2">
		<fa :icon="faExclamationTriangle"/>{{ $t('_poll.noOnlyOneChoice') }}
	</p>
	<ul ref="choices">
		<li v-for="(choice, i) in choices" :key="i">
			<x-input class="input" :value="choice" @input="onInput(i, $event)">
				<span>{{ $t('_poll.choiceN', { n: i + 1 }) }}</span>
			</x-input>
			<button @click="remove(i)" class="_button">
				<fa :icon="faTimes"/>
			</button>
		</li>
	</ul>
	<x-button class="add" v-if="choices.length < 10" @click="add">{{ $t('add') }}</x-button>
	<x-button class="add" v-else disabled>{{ $t('_poll.noMore') }}</x-button>
	<section>
		<x-switch v-model="multiple">{{ $t('_poll.canMultipleVote') }}</x-switch>
		<div>
			<x-select v-model="expiration">
				<template #label>{{ $t('_poll.expiration') }}</template>
				<option value="infinite">{{ $t('_poll.infinite') }}</option>
				<option value="at">{{ $t('_poll.at') }}</option>
				<option value="after">{{ $t('_poll.after') }}</option>
			</x-select>
			<section v-if="expiration === 'at'">
				<x-input v-model="atDate" type="date">
					<span>{{ $t('_poll.deadlineDate') }}</span>
				</x-input>
				<x-input v-model="atTime" type="time">
					<span>{{ $t('_poll.deadlineTime') }}</span>
				</x-input>
			</section>
			<section v-if="expiration === 'after'">
				<x-input v-model="after" type="number">
					<span>{{ $t('_poll.duration') }}</span>
				</x-input>
				<x-select v-model="unit">
					<option value="second">{{ $t('_time.second') }}</option>
					<option value="minute">{{ $t('_time.minute') }}</option>
					<option value="hour">{{ $t('_time.hour') }}</option>
					<option value="day">{{ $t('_time.day') }}</option>
				</x-select>
			</section>
		</div>
	</section>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import i18n from '../i18n';
import { erase } from '../../prelude/array';
import { addTimespan } from '../../prelude/time';
import { formatDateTimeString } from '../../misc/format-time-string';
import XInput from './ui/input.vue';
import XSelect from './ui/select.vue';
import XSwitch from './ui/switch.vue';
import XButton from './ui/button.vue';

export default Vue.extend({
	i18n,
	components: {
		XInput,
		XSelect,
		XSwitch,
		XButton,
	},
	data() {
		return {
			choices: ['', ''],
			multiple: false,
			expiration: 'infinite',
			atDate: formatDateTimeString(addTimespan(new Date(), 1, 'days'), 'yyyy-MM-dd'),
			atTime: '00:00',
			after: 0,
			unit: 'second',
			faExclamationTriangle, faTimes
		};
	},
	watch: {
		choices() {
			this.$emit('updated');
		}
	},
	methods: {
		onInput(i, e) {
			Vue.set(this.choices, i, e);
		},

		add() {
			this.choices.push('');
			this.$nextTick(() => {
				(this.$refs.choices as any).childNodes[this.choices.length - 1].childNodes[0].focus();
			});
		},

		remove(i) {
			this.choices = this.choices.filter((_, _i) => _i != i);
		},

		get() {
			const at = () => {
				return new Date(`${this.atDate} ${this.atTime}`).getTime();
			};

			const after = () => {
				let base = parseInt(this.after);
				switch (this.unit) {
					case 'day': base *= 24;
					case 'hour': base *= 60;
					case 'minute': base *= 60;
					case 'second': return base *= 1000;
					default: return null;
				}
			};

			return {
				choices: erase('', this.choices),
				multiple: this.multiple,
				...(
					this.expiration === 'at' ? { expiresAt: at() } :
					this.expiration === 'after' ? { expiredAfter: after() } : {})
			};
		},

		set(data) {
			if (data.choices.length == 0) return;
			this.choices = data.choices;
			if (data.choices.length == 1) this.choices = this.choices.concat('');
			this.multiple = data.multiple;
			if (data.expiresAt) {
				this.expiration = 'at';
				this.atDate = this.atTime = data.expiresAt;
			} else if (typeof data.expiredAfter === 'number') {
				this.expiration = 'after';
				this.after = data.expiredAfter;
			} else {
				this.expiration = 'infinite';
			}
		}
	}
});
</script>

<style lang="scss" scoped>
@import '../theme';

.zmdxowus {
	padding: 8px;

	> .caution {
		margin: 0 0 8px 0;
		font-size: 0.8em;
		color: #f00;

		> [data-icon] {
			margin-right: 4px;
		}
	}

	> ul {
		display: block;
		margin: 0;
		padding: 0;
		list-style: none;

		> li {
			display: flex;
			margin: 8px 0;
			padding: 0;
			width: 100%;

			> .input {
				flex: 1;
				margin-top: 16px;
				margin-bottom: 0;
			}

			> button {
				width: 32px;
				padding: 4px 0;
			}
		}
	}

	> .add {
		margin: 8px 0 0 0;
		z-index: 1;
	}

	> section {
		margin: 16px 0 -16px 0;

		> div {
			margin: 0 8px;

			&:last-child {
				flex: 1 0 auto;

				> section {
					align-items: center;
					display: flex;
					margin: -32px 0 0;

					> &:first-child {
						margin-right: 16px;
					}

					> .ui-input {
						flex: 1 0 auto;
					}
				}
			}
		}
	}
}
</style>
