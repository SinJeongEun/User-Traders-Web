import http from '@/utils/http';
const state = {
	listData: null,
	listDataDeatail: {},
	detailImageurl: [],
	totalPage: null,
	page: 1,
	newlistData: null,
	categories: [],
	subcategories: [],
};

const getters = {};
const actions = {
	getList({ commit }) {
		return http
			.process('boards', 'list/all')
			.then((data) => {
				commit('setListData', data);
			})
			.catch((err) => {
				console.log(err);
			});
	},
	getListDetail({ commit }, payload) {
		return http
			.process(
				'boards',
				'listdetail',
				{ id: payload.id },
				{ token: payload.jwt }
			)
			.then((data) => {
				commit('setListDataDetail', data);
			});
	},
	getCategories({ commit }) {
		return http
			.process('boards', 'categoryAll')
			.then((data) => {
				commit('setCategories', data);
			})
			.catch((err) => {
				console.log(err);
			});
	},

	getSubCategories({ commit }, payload) {
		return http
			.process('boards', 'categorySub', { subCategoryId: payload })
			.then((data) => {
				commit('setSubCategories', data);
			})
			.catch((err) => {
				console.log(err);
			});
	},
};

const mutations = {
	setListData(state, data) {
		state.listData = data;
	},
	setListDataDetail(state, data) {
		const arr = [];

		for (var i = 0; i < data.boardImageDto.length; i++) {
			arr.push(data.boardImageDto[i].path);
		}
		state.detailImageurl = arr;
		state.listDataDeatail = data.boardResponseLoginDto;
	},
	setCategories(state, data) {
		state.categories = data;
	},
	setSubCategories(state, data) {
		state.subcategories = data;
	},
};

export default {
	namespaced: true,
	getters,
	state,
	actions,
	mutations,
};
