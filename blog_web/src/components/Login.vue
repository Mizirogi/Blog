<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">登录</div>
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0px" class="demo-ruleForm">
				<el-form-item prop="name"><el-input v-model="ruleForm.name" placeholder="账号"></el-input></el-form-item>
				<el-form-item prop="password">
					<el-input v-model="ruleForm.pwd" type="password" placeholder="密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
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
		var checkValidate = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('手机号不能为空'));
			}
			setTimeout(() => {
				if (value != 123 && value != this.identifyCode) {
					callback(new Error('请输入正确的验证码'));
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
				validate: ''
			},
			rules: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				validate: [{ validator: checkValidate, trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.identifyCode = '';
		this.makeCode(this.identifyCodes, 4);
	},
	methods: {
		login(params) {
			console.log(this);
			this.$api.user.login(params).then(res => {
				let data = res.data;
				console.log(data);
				if (data.status == -1) {
					this.$message.error('该用户不存在');
					console.log('该用户不存在');
				} else if (data.status == -2) {
					this.$message.error('密码错误');
				} else if (data.status == 200) {
					this.$message({
						message: '登录成功',
						type: 'success'
					});
					console.log(data.token)
					localStorage.token = data.token;
					this.$store.commit('set_token', data.token);
					setTimeout(() => {
						this.$router.push('/index')
					}, 1000);
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
					self.login(self.ruleForm);
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
			console.log('验证码是' + this.identifyCode);
		}
	}
};
</script>

<style scoped>
	body{
		background: beige;
	}
.login-wrap {
}
.ms-title {
	font-size: 30px;
	color: #000;
	margin-bottom: 10px;
}
.ms-login {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
	width: 300px;
	height: 300px;
	padding: 40px;
	border-radius: 5px;
	background: #fff;
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
</style>
