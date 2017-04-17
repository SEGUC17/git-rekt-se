<template>
    <div>
        <div v-show="errors.length>0">
            <div class="error" v-for="error in errors">
                <el-alert :title="error" type="error" show-icon></el-alert>
            </div>
        </div>
        <el-table :data="businessData" stripe style="width: 100%">
            <el-table-column type="expand">
                <template scope="props">
                  <p>{{ props.row.shortDescription }}</p>
</template>
         </el-table-column>
        <el-table-column prop="name" label="Name" width="300">
        </el-table-column>
        <el-table-column prop="email" label="E-mail" width="280">
        </el-table-column>]
        <el-table-column prop="phoneNumbers" label="Phone Number(s)" width="280">
        </el-table-column>
        <el-table-column label="Operations" width="200">
<template scope="scope">
    <el-dialog title="Approve Request" v-model="acceptDialogue" size="tiny">
        <span>Are you sure you wish to accept this business request?</span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="acceptDialogue = false">Cancel</el-button>
                <el-button type="primary" @click="accept(scope.$index, businessData)">Yes, I'm sure.</el-button>
            </span>
    </el-dialog>
    <el-dialog title="Reject Request" v-model="rejectDialogue" size="tiny">
        <span>Are you sure you wish to reject this business request?</span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="rejectDialogue = false">Cancel</el-button>
                <el-button type="primary" @click="reject(scope.$index, businessData)">Yes, I'm sure.</el-button>
            </span>
    </el-dialog>
    
    <el-button class="button is-info" @click="acceptDialogue = true">
        Accept</el-button>
    <el-button class="button is-danger" @click="rejectDialogue = true">
        Reject</el-button>
</template>
    </el-table-column>
    </el-table>
</div>
</template>

<script>
    import Axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    export default {
    
        data() {
            return {
                errors: [],
                businessData: [],
                acceptDialogue: false,
                rejectDialogue: false,
            }
        },
        created() {
            this.fetchBusiness();
        },
    
        methods: {
            fetchBusiness() {
                axios.get(EndPoints.Admin().viewBusiness)
                    .then((res) => {
                        this.businessData = res.data;
                        errors=[];
                    })
                    .catch(err => {
                        for (var i = 0; i < err.response.data.errors.length; i++) {
                            this.errors.push(err.response.data.errors[i]);
                        }
                    });
            },
            accept(index, rows) {
                this.acceptDialogue = false,
                    axios.post(EndPoints.Admin().acceptBusiness(this.businessData[index]._id))
                    .then(() => {
                        rows.splice(index, 1);
                        this.$notify({
                            title: 'Success!',
                            message: 'Request approved!',
                            type: 'success'
                        });
                        errors=[];
                    })
                    .catch(err => {
                        for (var i = 0; i < err.response.data.errors.length; i++) {
                            this.errors.push(err.response.data.errors[i]);
                        }
                    });
            },
            reject(index, rows) {
                this.rejectDialogue = false,
                    axios.post(EndPoints.Admin().denyBusiness(this.businessData[index]._id))
                    .then(() => {
                        rows.splice(index, 1)
                        this.$notify({
                            title: 'Success!',
                            message: 'Request rejected!',
                            type: 'success'
                        });
                        errors=[];
                    })
                    .catch(err => {
                        for (var i = 0; i < err.response.data.errors.length; i++) {
                            this.errors.push(err.response.data.errors[i]);
                        }
                    });
            }
        }
    }
</script>