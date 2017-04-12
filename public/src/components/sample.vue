<template>
    <div class="sample">
        <el-button type="text" @click="dialogVisible = true">Sample Component with Dialog/Font and Icons</el-button>
        <el-dialog title="Tips" v-model="dialogVisible" size="tiny">
            <span>This is a message</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
            };
        }
    };
</script>
