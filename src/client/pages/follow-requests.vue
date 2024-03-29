<template>
<x-pagination :pagination="pagination" #default="{items}" class="dp-follow-requests" ref="list">
	<div class="user _panel" v-for="(req, i) in items" :key="req.id" :data-index="i">
		<dp-avatar class="avatar" :user="req.follower"/>
		<div class="body">
			<div class="name">
				<router-link class="name" :to="req.follower | userPage" v-user-preview="req.follower.id"><dp-user-name :user="req.follower"/></router-link>
				<p class="acct">@{{ req.follower | acct }}</p>
			</div>
			<div class="description" v-if="req.follower.description" :title="req.follower.description">
				<mfm :text="req.follower.description" :is-note="false" :author="req.follower" :i="$store.state.i" :custom-emojis="req.follower.emojis" :plain="true" :nowrap="true"/>
			</div>
			<div class="actions">
				<button class="_button" @click="accept(req.follower)"><fa :icon="faCheck"/></button>
				<button class="_button" @click="reject(req.follower)"><fa :icon="faTimes"/></button>
			</div>
		</div>
	</div>
</x-pagination>
</template>

<script lang="ts">
import Vue from 'vue';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import XPagination from '../components/ui/pagination.vue';

export default Vue.extend({
	metaInfo() {
		return {
			title: this.$t('followRequests')
		};
	},

	components: {
		XPagination
	},

	data() {
		return {
			pagination: {
				endpoint: 'following/requests/list',
				limit: 10,
			},
			faCheck, faTimes
		};
	},

	methods: {
		accept(user) {
			this.$root.api('following/requests/accept', { userId: user.id }).then(() => {
				this.$refs.list.reload();
			});
		},
		reject(user) {
			this.$root.api('following/requests/reject', { userId: user.id }).then(() => {
				this.$refs.list.reload();
			});
		}
	}
});
</script>

<style lang="scss" scoped>
@import '../theme';

.dp-follow-requests {
	> .user {
		display: flex;
		padding: 16px;

		> .avatar {
			display: block;
			flex-shrink: 0;
			margin: 0 12px 0 0;
			width: 42px;
			height: 42px;
			border-radius: 8px;
		}

		> .body {
			display: flex;
			width: calc(100% - 54px);
			position: relative;

			> .name {
				width: 45%;

				@media (max-width: 500px) {
					width: 100%;
				}

				> .name,
				> .acct {
					display: block;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin: 0;
				}

				> .name {
					font-size: 16px;
					line-height: 24px;
				}

				> .acct {
					font-size: 15px;
					line-height: 16px;
					opacity: 0.7;
				}
			}

			> .description {
				width: 55%;
				line-height: 42px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				opacity: 0.7;
				font-size: 14px;
				padding-right: 40px;
				padding-left: 8px;
				box-sizing: border-box;

				@media (max-width: 500px) {
					display: none;
				}
			}

			> .actions {
				position: absolute;
				top: 0;
				bottom: 0;
				right: 0;
				margin: auto 0;

				> button {
					padding: 12px;
				}
			}
		}
	}
}
</style>
