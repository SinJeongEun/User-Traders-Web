import http from '@/utils/http';

const getters = {};
const actions = {
    //getLike 
    getLike({ commit }) {
		return http
			.process('like', 'register')
			.then((data) => {
				commit('setListData', data); //수정하기!!!!!
			})
			.catch((err) => {
				console.log(err);
			});
	},
}

//postLike??

