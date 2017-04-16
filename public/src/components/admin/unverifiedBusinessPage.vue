<template>
    <el-table :data="businessData" stripe style="width: 100%">
        <el-table-column prop="name" label="Name" width="220">
        </el-table-column>
        <el-table-column prop="email" label="E-mail" width="220">
        </el-table-column>
        <el-table-column prop="shortDescription" label="Short Description" width="340">
        </el-table-column>
        <el-table-column prop="phoneNumbers" label="Phone Number(s)" width="145">
        </el-table-column>
        <el-table-column label="Operations" width="240">
            <template scope="scope">
                <el-button class="button is-info" @click="accept(scope.$index, businessData)">Accept</el-button>
                <el-button class="button is-danger" @click="reject(scope.$index, businessData)">Reject</el-button>
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
                axios.post(EndPoints.Admin().acceptBusiness(this.businessData[index]._id))
                    .then(() => {
                        rows.splice(index, 1);
                        alert('Business application Accepted!');
                    })
                    .catch(err => console.log(err));
    
            },
            reject(index, rows) {
                axios.post(EndPoints.Admin().denyBusiness(this.businessData[index]._id))
                    .then(() => {
                        rows.splice(index, 1)
                        alert('Business application Rejected!')
    
                    })
                    .catch(err => console.log(err));
            }
        }
    
    }
</script>