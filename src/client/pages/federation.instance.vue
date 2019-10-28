<template>
<x-modal ref="modal" @closed="() => { $emit('closed'); destroyDom(); }" :width="350" :height="350">
	<div class="dp-instance-info">
		<div class="header">
			<span>{{ instance.host }}</span>
			<button class="_button" @click="$refs.modal.close()"><fa :icon="faTimes"/></button>
		</div>
		<div class="body">
			<div class="table">
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faCrosshairs" fixed-width class="icon"/>{{ $t('foundAt') }}</div>
						<div class="data">{{ new Date(instance.caughtAt).toLocaleString() }}</div>
					</div>
				</div>
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faCloudDownloadAlt" fixed-width class="icon"/>{{ $t('following') }}</div>
						<div class="data">{{ instance.followingCount | number }}</div>
					</div>
					<div class="cell">
						<div class="label"><fa :icon="faCloudUploadAlt" fixed-width class="icon"/>{{ $t('followers') }}</div>
						<div class="data">{{ instance.followersCount | number }}</div>
					</div>
				</div>
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faUsers" fixed-width class="icon"/>{{ $t('users') }}</div>
						<div class="data">{{ instance.usersCount | number }}</div>
					</div>
					<div class="cell">
						<div class="label"><fa :icon="faPencilAlt" fixed-width class="icon"/>{{ $t('notes') }}</div>
						<div class="data">{{ instance.notesCount | number }}</div>
					</div>
				</div>
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faFileImage" fixed-width class="icon"/>{{ $t('files') }}</div>
						<div class="data">{{ instance.driveFiles | number }}</div>
					</div>
					<div class="cell">
						<div class="label"><fa :icon="faDatabase" fixed-width class="icon"/>{{ $t('storageUsage') }}</div>
						<div class="data">{{ instance.driveUsage | bytes }}</div>
					</div>
				</div>
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faLongArrowAltUp" fixed-width class="icon"/>{{ $t('latestRequestSentAt') }}</div>
						<div class="data"><dp-time v-if="instance.latestRequestSentAt" :time="instance.latestRequestSentAt"/><span v-else>N/A</span></div>
					</div>
					<div class="cell">
						<div class="label"><fa :icon="faTrafficLight" fixed-width class="icon"/>{{ $t('latestStatus') }}</div>
						<div class="data">{{ instance.latestStatus ? instance.latestStatus : 'N/A' }}</div>
					</div>
				</div>
				<div class="row">
					<div class="cell">
						<div class="label"><fa :icon="faLongArrowAltDown" fixed-width class="icon"/>{{ $t('latestRequestReceivedAt') }}</div>
						<div class="data"><dp-time v-if="instance.latestRequestReceivedAt" :time="instance.latestRequestReceivedAt"/><span v-else>N/A</span></div>
					</div>
				</div>
			</div>
			<div class="chart">
				<div class="header">
					<span class="label">{{ $t('charts') }}</span>
					<div class="selects">
						<x-select v-model="chartSrc" style="margin: 0;">
							<option value="requests">{{ $t('_instanceCharts.requests') }}</option>
							<option value="users">{{ $t('_instanceCharts.users') }}</option>
							<option value="users-total">{{ $t('_instanceCharts.usersTotal') }}</option>
							<option value="notes">{{ $t('_instanceCharts.notes') }}</option>
							<option value="notes-total">{{ $t('_instanceCharts.notesTotal') }}</option>
							<option value="ff">{{ $t('_instanceCharts.ff') }}</option>
							<option value="ff-total">{{ $t('_instanceCharts.ff-total') }}</option>
							<option value="drive-usage">{{ $t('_instanceCharts.cacheSize') }}</option>
							<option value="drive-usage-total">{{ $t('_instanceCharts.cacheSizeTotal') }}</option>
							<option value="drive-files">{{ $t('_instanceCharts.files') }}</option>
							<option value="drive-files-total">{{ $t('_instanceCharts.filesTotal') }}</option>
						</x-select>
						<x-select v-model="chartSpan" style="margin: 0;">
							<option value="hour">{{ $t('perHour') }}</option>
							<option value="day">{{ $t('perDay') }}</option>
						</x-select>
					</div>
				</div>
				<canvas ref="chart"></canvas>
			</div>
		</div>
	</div>
</x-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import i18n from '../i18n';
import { faTimes, faCrosshairs, faCloudDownloadAlt, faCloudUploadAlt, faUsers, faPencilAlt, faFileImage, faDatabase, faTrafficLight, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';
import XModal from '../components/modal.vue';
import XSelect from '../components/ui/select.vue';

const chartLimit = 50;
const sum = (...arr) => arr.reduce((r, a) => r.map((b, i) => a[i] + b));
const negate = arr => arr.map(x => -x);
const alpha = hex => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
	const r = parseInt(result[1], 16);
	const g = parseInt(result[2], 16);
	const b = parseInt(result[3], 16);
	return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

export default Vue.extend({
	i18n,

	components: {
		XModal,
		XSelect,
	},

	props: {
		instance: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			now: null,
			chart: null,
			chartSrc: 'requests',
			chartSpan: 'hour',
			faTimes, faCrosshairs, faCloudDownloadAlt, faCloudUploadAlt, faUsers, faPencilAlt, faFileImage, faDatabase, faTrafficLight, faLongArrowAltUp, faLongArrowAltDown
		};
	},

	computed: {
		data(): any {
			if (this.chart == null) return null;
			switch (this.chartSrc) {
				case 'requests': return this.requestsChart();
				case 'users': return this.usersChart(false);
				case 'users-total': return this.usersChart(true);
				case 'notes': return this.notesChart(false);
				case 'notes-total': return this.notesChart(true);
				case 'ff': return this.ffChart(false);
				case 'ff-total': return this.ffChart(true);
				case 'drive-usage': return this.driveUsageChart(false);
				case 'drive-usage-total': return this.driveUsageChart(true);
				case 'drive-files': return this.driveFilesChart(false);
				case 'drive-files-total': return this.driveFilesChart(true);
			}
		},

		stats(): any[] {
			const stats =
				this.chartSpan == 'day' ? this.chart.perDay :
				this.chartSpan == 'hour' ? this.chart.perHour :
				null;

			return stats;
		}
	},

	watch: {
		chartSrc() {
			this.renderChart();
		},

		chartSpan() {
			this.renderChart();
		}
	},

	async created() {
		this.now = new Date();

		const [perHour, perDay] = await Promise.all([
			this.$root.api('charts/instance', { host: this.instance.host, limit: chartLimit, span: 'hour' }),
			this.$root.api('charts/instance', { host: this.instance.host, limit: chartLimit, span: 'day' }),
		]);

		const chart = {
			perHour: perHour,
			perDay: perDay
		};

		this.chart = chart;

		this.renderChart();
	},

	methods: {
		setSrc(src) {
			this.chartSrc = src;
		},

		renderChart() {
			if (this.chartInstance) {
				this.chartInstance.destroy();
			}

			const color = getComputedStyle(document.documentElement).getPropertyValue('--fg');

			Chart.defaults.global.defaultFontColor = color;
			this.chartInstance = new Chart(this.$refs.chart, {
				type: 'line',
				data: {
					labels: new Array(chartLimit).fill(0).map((_, i) => this.getDate(i).toLocaleString()).slice().reverse(),
					datasets: this.data.series.map(x => ({
						label: x.name,
						data: x.data.slice().reverse(),
						pointRadius: 0,
						lineTension: 0,
						borderWidth: 2,
						borderColor: x.color,
						backgroundColor: alpha(x.color),
					}))
				},
				options: {
					layout: {
						padding: {
							left: 16,
							right: 16,
							top: 16,
							bottom: 16
						}
					},
					legend: {
						position: 'bottom',
					},
					scales: {
						xAxes: [{
							gridLines: {
								display: false
							},
							ticks: {
								display: false
							}
						}],
						yAxes: [{
							position: 'right',
							ticks: {
								display: false
							}
						}]
					},
					tooltips: {
						intersect: false,
						mode: 'index',
					}
				}
			});
		},

		getDate(ago: number) {
			const y = this.now.getFullYear();
			const m = this.now.getMonth();
			const d = this.now.getDate();
			const h = this.now.getHours();

			return this.chartSpan == 'day' ? new Date(y, m, d - ago) : new Date(y, m, d, h - ago);
		},

		format(arr) {
			return arr;
		},

		requestsChart(): any {
			return {
				series: [{
					name: 'Incoming',
					color: '#008FFB',
					data: this.format(this.stats.requests.received)
				}, {
					name: 'Outgoing (succeeded)',
					color: '#00E396',
					data: this.format(this.stats.requests.succeeded)
				}, {
					name: 'Outgoing (failed)',
					color: '#FEB019',
					data: this.format(this.stats.requests.failed)
				}]
			};
		},

		usersChart(total: boolean): any {
			return {
				series: [{
					name: 'Users',
					color: '#008FFB',
					data: this.format(total
						? this.stats.users.total
						: sum(this.stats.users.inc, negate(this.stats.users.dec))
					)
				}]
			};
		},

		notesChart(total: boolean): any {
			return {
				series: [{
					name: 'Notes',
					color: '#008FFB',
					data: this.format(total
						? this.stats.notes.total
						: sum(this.stats.notes.inc, negate(this.stats.notes.dec))
					)
				}]
			};
		},

		ffChart(total: boolean): any {
			return {
				series: [{
					name: 'Following',
					color: '#008FFB',
					data: this.format(total
						? this.stats.following.total
						: sum(this.stats.following.inc, negate(this.stats.following.dec))
					)
				}, {
					name: 'Followers',
					color: '#00E396',
					data: this.format(total
						? this.stats.followers.total
						: sum(this.stats.followers.inc, negate(this.stats.followers.dec))
					)
				}]
			};
		},

		driveUsageChart(total: boolean): any {
			return {
				bytes: true,
				series: [{
					name: 'Drive usage',
					color: '#008FFB',
					data: this.format(total
						? this.stats.drive.totalUsage
						: sum(this.stats.drive.incUsage, negate(this.stats.drive.decUsage))
					)
				}]
			};
		},

		driveFilesChart(total: boolean): any {
			return {
				series: [{
					name: 'Drive files',
					color: '#008FFB',
					data: this.format(total
						? this.stats.drive.totalFiles
						: sum(this.stats.drive.incFiles, negate(this.stats.drive.decFiles))
					)
				}]
			};
		},
	}
});
</script>

<style lang="scss" scoped>
@import '../theme';

.dp-instance-info {
	height: 100%;
	background: var(--bg);
	border-radius: 6px;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	> .header {
		display: flex;
		flex-shrink: 0;

		> button {
			height: 42px;
			width: 42px;
		}

		> span {
			flex: 1;
			line-height: 42px;
			padding-left: 16px;
			font-weight: bold;
		}
	}

	> .body {
		overflow: auto;

		> .table {
			padding: 0 16px;

			> .row {
				display: flex;

				&:not(:last-child) {
					margin-bottom: 8px;
				}

				> .cell {
					flex: 1;

					> .label {
						font-size: 80%;
						opacity: 0.7;

						> .icon {
							margin-right: 4px;
						}
					}
				}
			}
		}

		> .chart {
			margin-top: 8px;

			> .header {
				padding: 0 16px;

				> .label {
					font-size: 80%;
					opacity: 0.7;
				}

				> .selects {
					display: flex;
				}
			}
		}
	}
}
</style>