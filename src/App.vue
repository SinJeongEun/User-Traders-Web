<template>
	<v-app>
		<div>
			<v-app-bar
				flat
				color="orange accent-4"
				height="70"
				class="fixed-bar "
				fixed
			>
				<v-toolbar-title>
					<v-btn icon @click="$router.go(-1)">
						<v-icon size="xx-large" color="white">mdi-arrow-left</v-icon>
					</v-btn>
				</v-toolbar-title>

				<v-toolbar-title class="ma-2">
					<a
						href="/"
						style="text-decoration-line:none ; color:white; font-size : x-large "
					>
						User Traders
					</a>
				</v-toolbar-title>

				<v-spacer></v-spacer>

				<div v-if="loginflag">
					<v-btn icon :to="{ name: 'Cart' }">
						<v-icon size="xx-large" color="white">mdi-cart</v-icon>
					</v-btn>
				</div>

				<div v-if="!loginflag">
					<v-menu bottom left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								dark
								icon
								v-bind="attrs"
								v-on="on"
								align-center
								style="border:solid; border-width:2px; border-color: white;"
							>
								<v-icon size="xx-large" color="white">mdi-account-alert</v-icon>
							</v-btn>
						</template>

						<v-list dense nav>
							<v-list-item
								:to="{ name: 'UserLogin' }"
								active-class="deep-orange--text text--accent-3"
							>
								<v-list-item-content>
									<v-list-item-title
										align-center
										justify-center
										style="font-size : medium; text-align : center"
									>
										로그인
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>

							<v-list-item
								:to="{ name: 'SignUp' }"
								active-class="deep-orange--text text--accent-3"
							>
								<v-list-item-content>
									<v-list-item-title
										align-center
										justify-center
										style="font-size : medium; text-align : center"
									>
										회원가입
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item
								id="kakao-talk-channel-add-button"
								data-channel-public-id="_paeus"
								data-size="small"
								data-support-multiple-densities="true"
							>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div v-else>
					<v-menu bottom left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn dark icon v-bind="attrs" v-on="on">
								<v-icon size="xx-large" color="green">mdi-account-check</v-icon>
							</v-btn>
						</template>
						<v-list dense nav>
							<v-list-item
								active-class="deep-gray--text text--accent-3"
								style="cursor : pointer"
								:to="{ name: 'Profile' }"
							>
								<v-list-item-content>
									<v-list-item-title
										style="font-size : medium; text-align : center"
										>내 정보
										<v-icon large color="white">mdi-information</v-icon>
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>

							<v-list-item
								active-class="deep-gray--text text--accent-3"
								style="cursor : pointer"
							>
								<v-list-item-content>
									<v-list-item-title
										@click="userLogout"
										style="font-size : medium; text-align : center"
										>로그아웃
										<v-icon>mdi-logout</v-icon>
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
			</v-app-bar>
		</div>
		<v-spacer></v-spacer>
		<v-main>
			<router-view></router-view>
		</v-main>
		<v-bottom-navigation height="60" style="" color="#ff6d00" fixed>
			<v-btn :to="{ name: 'Home' }">
				<span style="color : #00000099; font-size : medium">홈</span>
				<v-icon large>mdi-home</v-icon>
			</v-btn>
			<div v-if="loginflag">
				<v-btn>
					<span style="color : #00000099;  font-size : medium">채팅</span>
					<v-icon large>mdi-chat</v-icon>
				</v-btn>
			</div>

			<v-btn :to="{ name: 'Search' }">
				<span style="color : #00000099; font-size : medium">검색</span>
				<v-icon large>mdi-shopping-search</v-icon>
			</v-btn>

			<div v-if="loginflag">
				<v-btn :to="{ name: 'Create' }">
					<span style="color : #00000099; font-size : medium">중고거래</span>
					<v-icon large color="blue">mdi-plus-circle-outline</v-icon>
				</v-btn>
			</div>

			<!-- <div v-if="loginflag">
				<v-btn @click="overlay = !overlay">
					<span style="color : #00000099; font-size : medium">카카오톡</span>
					<v-icon large color="blue">mdi-plus-circle-outline</v-icon></v-btn
				>
				<v-overlay :absolute="absolute" :value="overlay">
					<v-btn color="success" @click="overlay = false">
						Hide Overlay
					</v-btn>
				</v-overlay>
			</div> -->
		</v-bottom-navigation>
	</v-app>
</template>

<script>
window.kakaoAsyncInit = function() {
	Kakao.Channel.createAddChannelButton({
		container: '#kakao-talk-channel-add-button',
	});
};

(function(d, s, id) {
	var js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://developers.kakao.com/sdk/js/kakao.channel.min.js';
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'kakao-js-sdk');

import { mapState, mapActions } from 'vuex';

export default {
	data: () => ({
		overlay: false,
		openMenu: false,
		loginflag: false,
	}),
	mounted() {},

	computed: {
		...mapState({
			isLogin: (state) => state.users.isLogin,
			isLoginError: (state) => state.users.isLoginError,
		}),
	},
	mounted() {
		this.loginCheck();
	},
	methods: {
		loginCheck() {
			if (!localStorage.getItem('user')) {
				this.loginflag = false;
			} else {
				this.loginflag = true;
			}
		},

		userLogout() {
			this.getUserLogout().then(() => {
				this.isLoading = false;
				localStorage.removeItem('user');
				this.$router.push({ name: 'UserLogin' });
			});
		},
		...mapActions({
			getUserLogout: 'auth/getUserLogout',
		}),
	},
};
</script>
<style scoped>
.fixed-bar {
	position: sticky;
	position: -webkit-sticky; /* for Safari */
	top: 6em;
	z-index: 2;
}
</style>
