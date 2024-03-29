<template>
<div class="dp-app">
	<transition name="title-left">
		<div class="title" :key="title">
			<h1 v-text="title"></h1>
			<h2 v-text="subTitle"></h2>
		</div>
	</transition>
	<main>
		<transition name="title-top">
			<h1 class="title" v-if="showTitle" v-text="title" :key="title"></h1>
		</transition>
		<transition name="page" mode="out-in">
			<router-view :class="{ withTitle: showTitle }"></router-view>
		</transition>
		<div class="powerd-by" :class="{ visible: !$store.getters.isSignedIn }">
			<b><router-link to="/">{{ host }}</router-link></b>
			<small>Powered by <a href="https://github.com/mei23/dolphin" target="_blank">Dolphin</a></small>
		</div>
	</main>
	<x-ui/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from './i18n';
import { host } from './config';

export default Vue.extend({
	i18n,

	metaInfo() {
		return {
			changed: meta => {
				const title = meta.titleChunk.split('|');
				this.title = title.shift().trim();
				this.subTitle = title.join('|').trim();
				this.showTitle = !['index', 'user', 'note'].includes(this.$route.name);
			}
		};
	},

	components: {
		XNotifications: () => import('./components/notifications.vue').then(m => m.default),
		XUi: () => import('./app.ui.vue').then(m => m.default),
	},

	data() {
		return {
			host: host,
			title: null,
			subTitle: null,
			showTitle: false
		};
	},

	watch:{
		$route(to, from) {
			this.title = null;
			this.subTitle = null;
		}
	}
});
</script>

<style lang="scss" scoped>
@import './theme';

.title-left-enter-active, .title-left-leave-active {
	transition: opacity 0.5s, transform 0.5s !important;
}
.title-left-enter {
	opacity: 0;
	transform: translateX(32px);
}
.title-left-leave-to {
	opacity: 0;
	transform: translateX(-32px);
}

.title-top-enter-active, .title-top-leave-active {
	transition: opacity 0.5s, transform 0.5s !important;
}
.title-top-enter {
	opacity: 0;
	transform: scale(0.9);
}
.title-top-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.page-enter-active, .page-leave-active {
	transition: opacity 0.5s, transform 0.5s !important;
}
.page-enter {
	opacity: 0;
	transform: translateY(-32px);
}
.page-leave-to {
	opacity: 0;
	transform: translateY(32px);
}

.dp-app {
	> .title {
		position: fixed;
		z-index: -1;
		top: 64px;
		width: calc(50% - 352px);
		text-align: right;
		padding-left: 32px;
		box-sizing: border-box;
		font-size: 32px;

		@media (max-width: 1300px) {
			font-size: 26px;
		}

		@media (max-width: 1200px) {
			font-size: 20px;
		}

		@media (max-width: 1100px) {
			display: none;
		}

		> h1 {
			margin: 0;
			font-size: 100%;
		}

		> h2 {
			margin: 0;
			opacity: 0.5;
			font-size: 70%;
		}
	}

	> main {
		max-width: 650px;
		margin: 0 auto;
		padding: 32px;
		box-sizing: border-box;

		@media (max-width: 700px) {
			padding: 16px;
		}

		@media (max-width: 500px) {
			padding: 8px;
		}

		> .title {
			position: absolute;
			z-index: -1;
			margin: 0;
			line-height: 48px;

			@media (min-width: 1101px) {
				display: none;
			}

			@media (max-width: 700px) {
				font-size: 24px;
				line-height: 60px;
				left: 0;
				right: 0;
				text-align: center;
			}

			@media (max-width: 500px) {
				font-size: 18px;
			}
		}

		> .withTitle {
			margin-top: 70px;

			@media (max-width: 500px) {
				margin-top: 60px;
			}

			@media (min-width: 1101px) {
				margin-top: 0;
			}
		}

		> .powerd-by {
			font-size: 14px;
			text-align: center;
			margin: 32px 0;
			visibility: hidden;

			&.visible {
				visibility: visible;
			}

			&:not(.visible) {
				@media (min-width: 850px) {
					display: none;
				}
			}

			@media (max-width: 500px) {
				margin-top: 16px;
			}

			> small {
				display: block;
				margin-top: 8px;
				opacity: 0.5;

				@media (max-width: 500px) {
					margin-top: 4px;
				}
			}
		}
	}
}
</style>
