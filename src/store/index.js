import { createStore } from "vuex"
const state = {
  userinfo: {},
  collapse: false,
  tagsList: [],
  showBack: false,
  headerPopoverVisible: false,
  showProjectSelect: false,
  currentProject: null,
  projectList: []
}
const actions = {

}
const mutations = {
  setUserinfo(state, data) {
    state.userinfo = data
  },
  changeCollapse(state, data) {
    state.collapse = data;
  },
  delTagsItem(state, data) {
    state.tagsList.splice(data.index, 1);
  },
  addTagsItem(state, data) {
    state.tagsList.push(data)
  },
  replaceTagsItem(state, data) {
    state.tagsList.splice(data.index, 1, data.item);
  },
  clearTags(state) {
    state.tagsList = []
  },
  closeTagsOther(state, data) {
    state.tagsList = data;
  },

  setShowBack(state, data) {
    state.showBack = data
  },
  setHeaderPopoverVisible(state, data) {
    state.headerPopoverVisible = data
  },
  setShowProjectSelect(state, data) {
    state.showProjectSelect = data
  },
  setCurrentProject(state, data) {
    state.currentProject = data
  },
  setProjectList(state, data) {
    state.projectList = data
  },
}
export default createStore({
  state,
  mutations,
  actions
})