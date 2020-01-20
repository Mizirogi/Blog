<template>
	<div class="login-wrap">
		<div class="ms-title">登录管理系统</div>
		<div class="ms-login">
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0px">
				<div v-if="errorInfo">
					<span>{{ errInfo }}</span>
				</div>
				<el-form-item prop="name"><el-input v-model="ruleForm.name" placeholder="账号"></el-input></el-form-item>
				<el-form-item prop="pwd">
					<el-input v-model="ruleForm.pwd" type="password" placeholder="密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<el-form-item prop="nick"><el-input v-model="ruleForm.nick" placeholder="昵称"></el-input></el-form-item>
				<el-form-item prop="sex" >
					<el-select v-model="ruleForm.sex" class="wid" placeholder="性别">
						<el-option label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="email"><el-input v-model="ruleForm.email" placeholder="邮箱"></el-input></el-form-item>
				<el-form-item prop="phone"><el-input v-model="ruleForm.phone" placeholder="电话"></el-input></el-form-item>
				<el-form-item prop="validate">
					<el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码"></el-input>
					<div class="code" @click="refreshCode"><Identify :identify-code="identifyCode"></Identify></div>
				</el-form-item>
				<div class="login-btn"><el-button type="primary" @click="submitForm('ruleForm')">登录</el-button></div>
				<p style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:right;" @click="handleCommand()">注册</p>
			</el-form>
		</div>
	</div>
</template>

<script>
import Identify from './Identify.vue';
export default {
	name: 'Login',
	components: {
		Identify
	},
	data() {
		var checkPhone = (rule, value, callback) => {
			let regex = /^1(3|4|5|6|7|8|9)\d{9}$/;

			if (!value) {
				return callback(new Error('手机号不能为空'));
			}
			setTimeout(() => {
				if (!regex.test(value)) {
					callback(new Error('请输入正确手机号'));
				} else {
					callback();
				}
			}, 1000);
		};
		var checkEmail = (rule, value, callback) => {
			let regex = /^([\w-\.]+)@([\w-\.]+)(\.[a-zA-Z0-9]+)$/;
			if (!value) {
				return callback(new Error('邮箱不能为空'));
			}
			setTimeout(() => {
				if (!regex.test(value)) {
					callback(new Error('请输入正确邮箱'));
				} else {
					callback();
				}
			}, 1000);
		};
		return {
			identifyCodes: '1234567890',
			identifyCode: '',
			errorInfo: false,
			ruleForm: {
				name: '',
				pwd: '',
				sex: '',
				phone: '',
				email: '',
				validate: ''
			},
			rules: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				validate: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
				phone: [{ validator: checkPhone, trigger: 'blur' }],
				email: [{ validator: checkEmail, trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.identifyCode = '';
		this.makeCode(this.identifyCodes, 4);
	},
	methods: {
		register(params) {
			this.$api.user.register(params).then(res => {
				console.log(res);
				if (res.data == -1) {
					console.log('该用户不存在');
				} else if (res.data == 0) {
					console.log('密码错误');
				} else if (res.status == 200) {
				}
			});
		},
		submitForm(formName) {
			const self = this;
			self.$refs[formName].validate(valid => {
				if (valid) {
					localStorage.setItem('ms_username', self.ruleForm.name);
					localStorage.setItem('ms_user', JSON.stringify(self.ruleForm));
					console.log(JSON.stringify(self.ruleForm));
					self.register(self.ruleForm);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleCommand() {
			this.$router.push('/register');
		},
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		refreshCode() {
			this.identifyCode = '';
			this.makeCode(this.identifyCodes, 4);
		},
		makeCode(o, l) {
			for (let i = 0; i < l; i++) {
				this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
			}
			console.log(this.identifyCode);
		}
	}
};
</script>

<style scoped>
	body{
		
	}
.ms-title {
	font-size: 30px;
	color: #fff;
}
.ms-login {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
	width: 300px;
	padding: 20px;
	border-radius: 5px;
	background: #fff;
    height: min-content
}
.ms-login span {
	color: red;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
}
.code {
	width: 112px;
	height: 35px;
	border: 1px solid #ccc;
	float: right;
	border-radius: 2px;
}
.validate-code {
	width: 136px;
	float: left;
}
.wid{
	width: 300px;
}
</style>
