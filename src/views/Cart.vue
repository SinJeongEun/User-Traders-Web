<template>
	<v-container>
		<v-card>
			<h1 align="center" class="dark--text">
				<v-icon size="xxx-large" color="orange">mdi-gift</v-icon>
				나의 장바구니 현황
				<v-icon size="xxx-large" color="orange">mdi-gift</v-icon>
			</h1>
			<v-card v-for="(cart, index) in cartList" :key="cart.id">
				<div @click="detailPush(cart.board.id)">
					<v-layout>
						<v-flex xs3>
							<v-img
								v-bind:src="cart.board.imageurl1 | loadImgOrPlaceholder"
								contain
								height="125px"
							></v-img>
						</v-flex>
						<v-layout column>
							<v-card-title>
								<h4>{{ cart.board.title }}</h4>
							</v-card-title>
							<v-card-text>{{
								`가격 : ${cart.board.price} 원 ` | moneyFilter
							}}</v-card-text>
						</v-layout>
						<v-card-actions>
							<v-btn
								right
								color="blue-grey"
								class="ma-2 white--text"
								fab
								@click="cartDelete(index, cart.id)"
							>
								<v-icon dark>
									mdi-delete
								</v-icon>
							</v-btn>
						</v-card-actions>
					</v-layout>
				</div>
			</v-card>
			<v-card-subtitle>
				<h3 align="center">
					개수 :
					<span style="color: orange">{{ cartList.length }}</span>
					<p></p>
					총 가격 (₩ {{ total | moneyFilter }} 원)
				</h3>
			</v-card-subtitle>
		</v-card>
		<v-spacer />
	</v-container>
</template>

<script>
import http from '@/utils/http';
import Formatter from '@/mixin/Formatter';
import { userTokenValid } from '@/api/userValid';
import { mapActions } from 'vuex';
export default {
	mixins: [Formatter],
	data() {
		return {
			cartList: [],
		};
	},
	mounted() {
		const token = localStorage.getItem('user');
		if (!localStorage.getItem('user')) {
			this.$router.push({ name: 'UserLogin' });
		} else if (!userTokenValid(token)) {
			alert('토큰이 만료되었습니다. 다시 로그인 해주세요!!');
			this.$router.push({ name: 'UserLogin' });
		}
		this.getCartList(token);
	},
	methods: {
		getCartList(token) {
			return http
				.process('cart', 'list', null, { token: token })
				.then((res) => {
					this.cartList = res;
				})
				.catch((err) => {
					console.log(err.message);
					alert(err.message);
					this.getUserLogout().then(() => {
						this.isLoading = false;
						localStorage.removeItem('user');
						this.$router.push({ name: 'Home' });
					});
					this.$router.push(this.$route.query.redirect || '/user/login');
				});
		},
		...mapActions({
			getUserLogout: 'auth/getUserLogout',
		}),
		cartDelete(idx, id) {
			this.cartList.splice(idx, 1);
			return http
				.process('cart', 'remove', { id: id })
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		detailPush(id) {
			this.$router.push({ name: 'BoardDetail', params: { id: id } });
		},
	},

	computed: {
		total() {
			let total = 0;
			this.cartList.forEach((cartItem) => {
				total += parseInt(cartItem.board.price);
			});
			return total;
		},
	},
};
</script>
