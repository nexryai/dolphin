<template>
<section class="dp-settings-page-security _section">
	<div class="title"><fa :icon="faLock"/> {{ $t('security') }}</div>
	<div class="content">
		<x-button primary @click="change()">{{ $t('changePassword') }}</x-button>
	</div>
</section>
</template>

<script lang="ts">
import Vue from 'vue';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import XButton from '../components/ui/button.vue';
import i18n from '../i18n';

export default Vue.extend({
	i18n,

	components: {
		XButton,
	},
	
	data() {
		return {
			faLock
		}
	},

	methods: {
		async change() {
			const { canceled: canceled1, result: currentPassword } = await this.$root.dialog({
				title: this.$t('currentPassword'),
				input: {
					type: 'password'
				}
			});
			if (canceled1) return;

			const { canceled: canceled2, result: newPassword } = await this.$root.dialog({
				title: this.$t('newPassword'),
				input: {
					type: 'password'
				}
			});
			if (canceled2) return;

			const { canceled: canceled3, result: newPassword2 } = await this.$root.dialog({
				title: this.$t('newPasswordRetype'),
				input: {
					type: 'password'
				}
			});
			if (canceled3) return;

			if (newPassword !== newPassword2) {
				this.$root.dialog({
					type: 'error',
					text: this.$t('retypedNotMatch')
				});
				return;
			}

			const dialog = this.$root.dialog({
				type: 'waiting',
				iconOnly: true
			});
			
			this.$root.api('i/change-password', {
				currentPassword,
				newPassword
			}).then(() => {
				this.$root.dialog({
					type: 'success',
					iconOnly: true, autoClose: true
				});
			}).catch(e => {
				this.$root.dialog({
					type: 'error',
					text: e
				});
			}).finally(() => {
				dialog.close();
			});
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
