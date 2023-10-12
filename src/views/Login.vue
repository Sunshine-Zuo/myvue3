<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">XXXX系统</div>
            <el-form :model="param" :rules="rules" ref="loginform" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账户">
                        <template #prepend>
                            <!-- <el-button :icon="User"></el-button> -->
                            <el-icon class="grid-cont-icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter="submitForm()">
                        <template #prepend>
                            <!-- <el-button :icon="Bell"></el-button> -->
                            <el-icon class="grid-cont-icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
        <div class="company">上海蜂雀科技</div>
    </div>
</template>

<script>
import { login, getCurrentUserInfo } from "@/utils/api.js";
import { enRsa } from '@/utils/util.js'
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from '@element-plus/icons-vue'

export default {
    components: { User, Lock },
    setup() {
        const router = useRouter();
        const store = useStore();
        const param = reactive({
            username: "",
            password: "",
        });

        const rules = {
            username: [
                { required: true, message: "请输入账户", trigger: "blur", },
            ],
            password: [
                { required: true, message: "请输入密码", trigger: "blur" },
            ],
        };
        const loginform = ref(null);
        const submitForm = () => {
            loginform.value.validate(async (valid) => {
                // localStorage.setItem('token', 'gdshdjghjh')
                // store.commit("setUserinfo", { username: 'username' });
                // router.push("/");
                if (valid) {
                    const res = await login({ key: param.username, password: enRsa(param.password) })
                    if (res.data && res.data.token) {
                        ElMessage.success("登录成功");
                        // console.log('res.data?.token', res.data.token);
                        localStorage.setItem('token', res.data.token)
                        let res1 = await getCurrentUserInfo()
                        let userinfo = res1.data
                        // console.log('userinfo', userinfo);
                        router.push("/");
                        localStorage.setItem("userinfo", JSON.stringify(userinfo));
                        store.commit("setUserinfo", userinfo);
                        store.commit("clearTags");
                    }
                } else {
                    ElMessage.error("登录失败");
                    return false;
                }
            });
        };


        return {
            param,
            rules,
            loginform,
            submitForm,
        };
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('../assets/img/login-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 400px;
    padding: 50px;
    margin: -150px 0 0 -150px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}

.company {
    color: #fff;
    font-size: 12px;
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%);
}
</style>