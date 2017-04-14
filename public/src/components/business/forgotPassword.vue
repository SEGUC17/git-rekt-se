<<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <div>
                <div class="alert" v-show="alert_show">
                    <div class="message">
                        <el-alert :title="message" type="info" show-icon></el-alert>
                    </div>
                </div>
    
                <h1 class="title has-text-centered">Forgot Password</h1>
    
                <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="Email" prop="email" :rules="rules">
                        <el-input type="text" v-model="form.email" auto-complete="off"></el-input>
                    </el-form-item>
    
                    <el-form-item>
                        <el-button type="primary" :disabled="btn_disable" @click="submitForm('form')">Submit</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import EndPoints from '../../services/EndPoints';
    
    export default {
        data() {
            return {
                form: new Form({
                    email: '',
                }),
                rules: [{
                        required: true,
                        message: 'Please input email address',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Please input correct email address',
                        trigger: 'blur,change'
                    }
                ],
                message: '',
                alert_show: false,
                btn_disable: false,
    
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.post(EndPoints.Business().forgot)
                            .then((data) => {
                                console.log(data);
                                this.message = data.message;
                                this.alert_show = true;
                            })
                            .catch((err) => {
                                console.log(err);
                                this.message = data.message;
                                this.alert_show = true;
                            });
                    } else {
                        this.message = 'Please insert correct inputs';
                        this.alert_show = true;
                    }
                });
            },
        }
    }
</script>
