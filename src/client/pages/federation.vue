<template>
<div class="dp-federation">
	<section class="_section instances">
		<div class="title"><fa :icon="faGlobe"/> {{ $t('instances') }}</div>
		<div class="content">
			<div class="inputs" style="display: flex;">
				<x-input v-model="host" :debounce="true" style="margin: 0; flex: 1;"><span>{{ $t('host') }}</span></x-input>
				<x-select v-model="state" style="margin: 0;">
					<option value="all">{{ $t('all') }}</option>
					<option value="federating">{{ $t('federating') }}</option>
					<option value="subscribing">{{ $t('subscribing') }}</option>
					<option value="publishing">{{ $t('publishing') }}</option>
					<option value="suspended">{{ $t('suspended') }}</option>
					<option value="blocked">{{ $t('blocked') }}</option>
					<option value="notResponding">{{ $t('notResponding') }}</option>
				</x-select>
			</div>
		</div>
		<div class="content">
			<x-pagination :pagination="pagination" #default="{items}" class="instances" ref="instances" :key="host + state">
				<div class="instance" v-for="(instance, i) in items" :key="instance.id" :data-index="i" @click="info(instance)">
					<div class="host"><fa :icon="faCircle" class="indicator" :class="getStatus(instance)"/><b>{{ instance.host }}</b></div>
					<div class="status">
						<span class="sub" v-if="instance.followersCount > 0"><fa :icon="faCaretDown" class="icon"/>Sub</span>
						<span class="sub" v-else><fa :icon="faCaretDown" class="icon"/>-</span>
						<span class="pub" v-if="instance.followingCount > 0"><fa :icon="faCaretUp" class="icon"/>Pub</span>
						<span class="pub" v-else><fa :icon="faCaretUp" class="icon"/>-</span>
						<span class="lastCommunicatedAt"><fa :icon="faExchangeAlt" class="icon"/><dp-time :time="instance.lastCommunicatedAt"/></span>
						<span class="latestStatus"><fa :icon="faTrafficLight" class="icon"/>{{ instance.latestStatus || '-' }}</span>
					</div>
				</div>
			</x-pagination>
		</div>
	</section>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { faGlobe, faCircle, faExchangeAlt, faCaretDown, faCaretUp, faTrafficLight } from '@fortawesome/free-solid-svg-icons';
import i18n from '../i18n';
import XButton from '../components/ui/button.vue';
import XInput from '../components/ui/input.vue';
import XSelect from '../components/ui/select.vue';
import XPagination from '../components/ui/pagination.vue';
import DpInstanceInfo from './federation.instance.vue';

export default Vue.extend({
	i18n,

	metaInfo() {
		return {
			title: this.$t('federation')
		};
	},

	components: {
		XButton,
		XInput,
		XSelect,
		XPagination,
	},

	data() {
		return {
			host: '',
			state: 'federating',
			sort: '+pubSub',
			pagination: {
				endpoint: 'federation/instances',
				limit: 10,
				offsetMode: true,
				params: () => ({
					sort: this.sort,
					host: this.host != '' ? this.host : null,
					...(
						this.state === 'federating' ? { federating: true } :
						this.state === 'subscribing' ? { subscribing: true } :
						this.state === 'publishing' ? { publishing: true } :
						this.state === 'suspended' ? { suspended: true } :
						this.state === 'blocked' ? { blocked: true } :
						this.state === 'notResponding' ? { notResponding: true } :
						{})
				})
			},
			faGlobe, faCircle, faExchangeAlt, faCaretDown, faCaretUp, faTrafficLight
		}
	},

	watch: {
		host() {
			this.$refs.instances.reload();
		},
		state() {
			this.$refs.instances.reload();
		}
	},

	methods: {
		getStatus(instance) {
			if (instance.isSuspended) return 'off';
			if (instance.isNotResponding) return 'red';
			return 'green';
		},

		info(instance) {
			this.$root.new(DpInstanceInfo, {
				instance: instance
			});
		}
	}
});
</script>

<style lang="scss" scoped>
.dp-federation {
	> .instances {
		> .content {
			> .instances {
				> .instance {
					cursor: pointer;

					&:hover {
						background: rgba(0, 0, 0, 0.05);
						box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.05);

						@media (prefers-color-scheme: dark) {
							background: rgba(255, 255, 255, 0.05);
							box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.05);
						}
					}

					> .host {
						> .indicator {
							font-size: 70%;
							vertical-align: baseline;
							margin-right: 4px;

							&.green {
								color: #49c5ba;
							}

							&.yellow {
								color: #c5a549;
							}

							&.red {
								color: #c54949;
							}

							&.off {
								color: rgba(0, 0, 0, 0.5);
							}
						}
					}

					> .status {
						display: flex;
						align-items: center;
						font-size: 90%;

						> span {
							flex: 1;
							
							> .icon {
								margin-right: 6px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
