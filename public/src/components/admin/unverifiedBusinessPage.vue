<template>
    <el-table :data="businessData" stripe style="width: 100%">
        <el-table-column type="expand">
            <template scope="props">
              <p>Short Description: {{ props.row.shortDescription }}</p>
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
</template>

<script>
    import Axios from 'axios';
    import EndPoints from '../../services/EndPoints';
    export default {
    
        data() {
            return {
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
                console.log('fetching');
                axios.get(EndPoints.Admin().viewBusiness)
                    .then((res) => {
                        console.log(res.data);
                        this.businessData = res.data;
                    })
                    .catch(err => console.log(err));
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
                    })
                    .catch(err => console.log(err));
    
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
    
                    })
                    .catch(err => console.log(err));
            }
        }
    
    }
</script>