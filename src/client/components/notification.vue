<template>
<div class="dp-notification" :class="notification.type">
	<dp-avatar class="avatar" :user="notification.user"/>
	<div class="icon" :class="notification.type">
		<fa :icon="faPlus" v-if="notification.type === 'follow'"/>
		<fa :icon="faClock" v-if="notification.type === 'receiveFollowRequest'"/>
		<fa :icon="faRetweet" v-if="notification.type === 'renote'"/>
		<fa :icon="faReply" v-if="notification.type === 'reply'"/>
		<fa :icon="faAt" v-if="notification.type === 'mention'"/>
		<fa :icon="faQuoteLeft" v-if="notification.type === 'quote'"/>
		<x-reaction-icon v-if="notification.type === 'reaction'" :reaction="notification.reaction" :customEmojis="notification.note.emojis" :no-style="true"/>
	</div>
	<header>
		<router-link class="name" :to="notification.user | userPage"><dp-user-name :user="notification.user"/></router-link>
		<dp-time :time="notification.createdAt" v-if="withTime"/>
	</header>
	<router-link v-if="notification.type === 'reaction'" class="text" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
		<fa :icon="faQuoteLeft"/>
		<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
		<fa :icon="faQuoteRight"/>
	</router-link>
	<router-link v-if="notification.type === 'renote'" class="text" :to="notification.note | notePage" :title="getNoteSummary(notification.note.renote)">
		<fa :icon="faQuoteLeft"/>
		<mfm :text="getNoteSummary(notification.note.renote)" :plain="true" :nowrap="true" :custom-emojis="notification.note.renote.emojis"/>
		<fa :icon="faQuoteRight"/>
	</router-link>
	<router-link v-if="notification.type === 'reply'" class="text" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
		<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
	</router-link>
	<router-link v-if="notification.type === 'mention'" class="text" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
		<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
	</router-link>
	<router-link v-if="notification.type === 'quote'" class="text" :to="notification.note | notePage" :title="getNoteSummary(notification.note)">
		<mfm :text="getNoteSummary(notification.note)" :plain="true" :nowrap="true" :custom-emojis="notification.note.emojis"/>
	</router-link>
	<span v-if="notification.type === 'follow'" class="text" style="opacity: 0.6;">{{ $t('youGotNewFollower') }}</span>
	<span v-if="notification.type === 'receiveFollowRequest'" class="text" style="opacity: 0.6;">{{ $t('receiveFollowRequest') }}</span>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { faPlus, faQuoteLeft, faQuoteRight, faRetweet, faReply, faAt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import getNoteSummary from '../../misc/get-note-summary';
import XReactionIcon from './reaction-icon.vue';

export default Vue.extend({
	components: {
		XReactionIcon
	},
	props: {
		notification: {
			type: Object,
			required: true,
		},
		withTime: {
			type: Boolean,
			required: false,
			default: false,
		}
	},
	data() {
		return {
			getNoteSummary,
			faPlus, faQuoteLeft, faQuoteRight, faRetweet, faReply, faAt, faClock
		};
	},
});
</script>

<style lang="scss" scoped>
.dp-notification {
	position: relative;
	height: 66px;
	box-sizing: border-box;
	padding: 12px;
	font-size: 13px;
	overflow-wrap: break-word;

	&:after {
		content: "";
		display: block;
		clear: both;
	}

	> .avatar {
		display: block;
		width: 42px;
		height: 42px;
		border-radius: 6px;
	}

	> .icon {
		position: absolute;
		z-index: 1;
		top: 36px;
		left: 36px;
		width: 20px;
		height: 20px;
		box-sizing: border-box;
		border-radius: 100%;
		background: var(--bg);
		box-shadow: 0 0 0 3px var(--bg);
		font-size: 12px;

		> * {
			color: #fff;
			width: 100%;
			height: 100%;
		}

		&.follow {
			padding: 3px;
			background: #36aed2;
		}

		&.receiveFollowRequest {
			padding: 3px;
			background: #36aed2;
		}

		&.retweet {
			padding: 3px;
			background: #36d298;
		}

		&.quote {
			padding: 3px;
			background: #36d298;
		}

		&.reply {
			padding: 3px;
			background: #007aff;
		}

		&.mention {
			padding: 3px;
			background: #88a6b7;
		}
	}

	> header {
		position: absolute;
		top: 14px;
		left: 62px;
		display: flex;
		align-items: baseline;
		white-space: nowrap;
		width: calc(100% - 76px);
		line-height: 16px;

		> .name {
			text-overflow: ellipsis;
			white-space: nowrap;
			min-width: 0;
			overflow: hidden;
		}

		> .dp-time {
			margin-left: auto;
			font-size: 0.9em;
		}
	}

	> .text {
		position: absolute;
		top: 33px;
		left: 62px;
		width: calc(100% - 76px);
		line-height: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		> [data-icon] {
			vertical-align: super;
			font-size: 50%;
			opacity: 0.5;
		}

		> [data-icon]:first-child {
			margin-right: 4px;
		}

		> [data-icon]:last-child {
			margin-left: 4px;
		}
	}
}
</style>
