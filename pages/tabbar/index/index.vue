<template>
	<canvas-page :terminal="terminal" :typeId="1"></canvas-page>
</template>

<script>
	const API = require('@/config/api')
	import canvasPage from '@/components/canvasShow/canvasHomePage.vue'
	import canvasShowPage from '@/components/canvasShow/canvasShowPage.vue'
	export default {
		components: {
		   canvasPage
		},
		data() {
			return {
				terminal: API.terminal,
			}
		},
		
	};
</script>