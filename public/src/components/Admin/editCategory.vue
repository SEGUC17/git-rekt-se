<template>
    <div class="categories-admin">

        <!-- Errors -->

        <div class="errors" v-if="generalErrors.length > 0">
            <el-alert v-for="error in generalErrors" class="error" :title="error"
                      type="error" :key="error | appendRandom" show-icon></el-alert>
        </div>


        <!-- Success Messages -->
        <div class="errors">
            <el-alert v-if="createSuccess" type="success" class="error" :title="createSuccess" show-icon></el-alert>
            <el-alert v-if="editSuccess" type="success" class="error" :title="editSuccess" show-icon></el-alert>
            <el-alert v-if="deleteSuccess" type="success" class="error" :title="deleteSuccess" show-icon></el-alert>
        </div>

        <!-- Modals -->

        <!--Add Category Modal-->
        <el-dialog title="Add Category" v-model="addVisible" size="large">
            <div class="errors" v-show="createErrors.length > 0">
                <el-alert v-for="error in createErrors" class="error" :title="error"
                          type="error" :key="error | appendRandom" show-icon></el-alert>
            </div>
            <el-form :model="newCategory" ref="createCategory" :rules="categoryRules" label-position="top">

                <el-form-item label="Type" required prop="type">
                    <el-select v-model="newCategory.type" placeholder="Category Type">
                        <el-option label="Service" value="Service"></el-option>
                        <el-option label="Business" value="Business"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Title" required prop="title">
                    <el-input v-model="newCategory.title" placeholder="Title of your category"></el-input>
                </el-form-item>

                <el-form-item class="is-pulled-right">
                    <el-button type="primary" @click="createCategory">Create</el-button>
                    <el-button @click="resetCreate">Clear</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <!-- Edit Category Modal -->

        <el-dialog title="Edit Category" v-model="editVisible" size="large">
            <div class="errors">
                <el-alert v-for="error in editErrors" type="error" 
                          :key="error | appendRandom" :title="error" show-icon></el-alert>
            </div>
            <el-form ref="editCategory" :model="categoryToEdit" :rules="categoryRules" label-position="top">

                <el-form-item label="Type" required prop="type">
                    <el-select v-model="categoryToEdit.type" placeholder="Category Type">
                        <el-option label="Service" value="Service"></el-option>
                        <el-option label="Business" value="Business"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Title" required prop="title">
                    <el-input v-model="categoryToEdit.title" placeholder="The title of your Category"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editCategory">Edit</el-button>
            </span>

        </el-dialog>

        <!-- Delete Category Modal -->
        <el-dialog title="Delete Category" v-model="deleteVisible" size="small">
            <span>This cannot be undone. Delete this Category?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">Cancel</el-button>
                <el-button type="danger" @click="deleteCategory">Delete</el-button>
            </span>
        </el-dialog>

        <!-- Add Category -->
        <el-button v-show="categories.length > 0" size="large" class="margin-bot-1" @click="showAdd()" type="primary">
            Add Category
        </el-button>

        <!-- Data -->
        <b-table v-show="categories.length > 0"
                 :data="categories"
                 :striped="true"
                 :narrowed="false"
                 :mobile-cards="true"
                 :paginated="true"
                 :per-page="10"
                 :pagination-simple="false"
                 default-sort="title"
                 render-html>
            <b-table-column field="title" label="Title" sortable></b-table-column>
            <b-table-column field="type" label="Category Type" sortable></b-table-column>
            <b-table-column field="_id" label="Action" component="category-actions-btns"></b-table-column>
        </b-table>

        <!-- No data found. -->
        <div class="no-data hero" v-show="categories.length === 0">
            <div class="hero-body has-text-centered">
                <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
                <p class="title is-2">No Categories Found.</p>
                <a class="button is-info" @click.prevent="showAdd()">Add New One?</a>
            </div>
        </div>

    </div>
</template>

<script>
  import axios from 'axios';
  import {categoryRules} from '../../services/validation';
  import {Admin} from '../../services/EndPoints';
  import AdminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    data() {
      return {
        categories: [],
        newCategory: {
          type: '',
          title: '',
          icon: '',
        },
        generalErrors: [],
        categoryRules,
        createSuccess: '',
        createErrors: [],
        categoryToEdit: {
          _id: '',
          type: '',
          title: '',
          icon: '',
        },
        editVisible: false,
        editSuccess: '',
        editErrors: [],
        categoryToDelete: {
          _id: '',
        },
        deleteVisible: false,
        deleteSuccess: '',
        deleteErrors: [],
        addVisible: false,
      };
    },
    methods: {
      createCategory() {
        this.createSuccess = '';
        this.createErrors = [];
        this.$refs.createCategory.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            axios.post(Admin().createCategory, this.newCategory, {
              headers: {
                Authorization: AdminAuth.getJWTtoken(),
              },
            })
                .then((response) => {
                  loader.close();
                  this.createSuccess = response.data.message;
                  this.addVisible = false;
                  this.resetCreate();
                  this.getCategories();
                })
                .catch((error) => {
                  loader.close();
                  this.createErrors = error.response.data.errors.map((err) => {
                    if (typeof err === 'string') {
                      return err;
                    }
                    return err.msg;
                  });
                });
          }
        });
      },
      editCategory() {
        this.editSuccess = '';
        this.editErrors = [];
        this.$refs.editCategory.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            axios.post(Admin().editCategory(this.categoryToEdit._id), this.categoryToEdit, {
              headers: {
                Authorization: AdminAuth.getJWTtoken(),
              },
            })
                .then((response) => {
                  this.editSuccess = response.data.message;
                  this.editVisible = false;
                  loader.close();
                  this.getCategories();
                })
                .catch((error) => {
                  loader.close();
                  this.editErrors = error.response.data.errors.map((err) => {
                    if (typeof err === 'string') {
                      return err;
                    }
                    return err.msg;
                  });
                });
          }
        });
      },
      deleteCategory() {
        this.deleteSuccess = '';
        this.deleteErrors = [];
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Admin().deleteCategory(this.categoryToDelete._id), null, {
          headers: {
            Authorization: AdminAuth.getJWTtoken(),
          },
        })
            .then((response) => {
              this.deleteSuccess = response.data.message;
              this.deleteVisible = false;
              this.getCategories();
              loader.close();
            })
            .catch((error) => {
              loader.close();
              this.deleteErrors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
            });
      },
      resetCreate() {
        this.$refs.createCategory.resetFields();
      },
      getCategories() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Admin().listCategories, {
          headers: {
            Authorization: AdminAuth.getJWTtoken(),
          },
        })
            .then((response) => {
              loader.close();
              this.categories = response.data.category;
            })
            .catch((error) => {
              loader.close();
              this.generalErrors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
            });
      },
      showEdit(category) {
        this.categoryToEdit = Object.assign({}, category);
        this.editVisible = true;
      },
      showAdd() {
        this.addVisible = true;
      },
      showDelete(category) {
        this.categoryToDelete = Object.assign({}, category);
        this.deleteVisible = true;
      },
    },
    mounted() {
      EventBus.$on('showEditDialog', this.showEdit);
      EventBus.$on('showDeleteDialog', this.showDelete);

      this.getCategories();
      axios.get(Admin().listCategories, {
        headers: {
          Authorization: AdminAuth.getJWTtoken(),
        },
      })
          .then((response) => {
            this.categories = response.data.category;
          })
          .catch((error) => {
            this.generalErrors = error.response.data.errors.map((err) => {
              if (typeof err === 'string') {
                return err;
              }
              return err.msg;
            });
          });
    },

  };
</script>
